import React, { useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import "./StripePayment.css";
import "./common.css";
import { COUNTRIES_AND_CODE } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { useCartHomeMade } from "../CartContext";
import emailjs from "emailjs-com";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_KEY || "temp"
);

export function StripePayment() {
  const { t } = useTranslation();

  return (
    <div className="stripe-payment-container">
      <h2>{t("stripe-payment.title")}</h2>
      <Elements stripe={stripePromise}>
        <StripeForm />
      </Elements>
    </div>
  );
}

const StripeForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, clientSecret, cartIdState, handleCartIdChange } =
    useCartHomeMade();
  const [loading, setLoading] = useState(false);
  const [editingBilling, setEditingBilling] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [billingDetails, setBillingDetails] = useState({
    company: cart?.shipping_address?.company || "",
    firstName: cart?.shipping_address?.first_name || "",
    lastName: cart?.shipping_address?.last_name || "",
    address1: cart?.shipping_address?.address_1 || "",
    address2: cart?.shipping_address?.address_2 || "",
    city: cart?.shipping_address?.city || "",
    postalCode: cart?.shipping_address?.postal_code || "",
    countryCode: cart?.shipping_address?.country_code || "",
  });

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const saveBillingDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_MEDUSA_API_URL
        }/store/carts/${cartIdState}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env
              .VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
          },
          body: JSON.stringify({
            billing_address: {
              company: billingDetails.company,
              first_name: billingDetails.firstName,
              last_name: billingDetails.lastName,
              address_1: billingDetails.address1,
              address_2: billingDetails.address2,
              city: billingDetails.city,
              postal_code: billingDetails.postalCode,
              country_code: billingDetails.countryCode,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(t("stripe-payment.save_error"));
      }
    } catch (error) {
      console.error("Error updating billing address:", error);
    } finally {
      setLoading(false);
      setEditingBilling(false);
    }
  };

  async function handlePayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    to_name: string
  ) {
    e.preventDefault();
    const card = elements?.getElement(CardElement);

    if (!stripe || !elements || !card || !cart || !clientSecret) {
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_WHEN_ORDER;
    const publicKey = import.meta.env.VITE_EMAILJS_API_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      return;
    }

    setLoading(true);
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            email: cart.email,
            phone: cart.shipping_address?.phone,
            address: {
              city: billingDetails.city,
              country: billingDetails.countryCode,
              line1: billingDetails.address1,
              line2: billingDetails.address2,
              postal_code: billingDetails.postalCode,
            },
          },
        },
      })
      .then(async ({ error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setLoading(true);
        await fetch(
          `${
            import.meta.env.VITE_REACT_APP_MEDUSA_API_URL
          }/store/carts/${cartIdState}/complete`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "x-publishable-api-key": import.meta.env
                .VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
            },
            body: JSON.stringify({}),
          }
        )
          .then((res) => res.json())
          .then(({ type, data, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            if (type === "order") {
              handleCartIdChange(undefined);
              emailjs.send(
                serviceId,
                templateId,
                {
                  to_name: to_name,
                  email: data.email,
                  order_id: data.id,
                },
                publicKey
              );
              navigate(`/success-order`);
            }
          });
      })
      .finally(() => setLoading(false));
  }

  return (
    <div>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h3>{t("stripe-payment.payment_in_full")}</h3>
      <div className="payment-choice">
        <label>
          <input type="radio" name="option" value="creditCard" />
          {t("stripe-payment.credit_card_option")}
        </label>
      </div>
      <form>
        <label htmlFor="card-element">
          {t("stripe-payment.card_details_label")}
        </label>
        <CardElement id="card-element" className="stripe-card-element" />

        <div className="invoice-address">
          <h4>{t("stripe-payment.invoice_address")}</h4>
          {!editingBilling ? (
            <div>
              <p>{billingDetails.company}</p>
              <p>
                {billingDetails.firstName} {billingDetails.lastName}
              </p>
              <p>{billingDetails.address1}</p>
              {billingDetails.address2 && <p>{billingDetails.address2}</p>}
              <p>
                {billingDetails.postalCode} {billingDetails.city}
              </p>
              <p>
                {
                  COUNTRIES_AND_CODE.find(
                    (country) => country.code === billingDetails.countryCode
                  )?.country
                }
              </p>
              <button
                type="button"
                className="edit-billing-button"
                onClick={() => setEditingBilling(true)}
              >
                {t("stripe-payment.edit_button")}
              </button>
            </div>
          ) : (
            <div className="billing-address-form">
              <input
                type="text"
                name="company"
                placeholder={t("stripe-payment.company_placeholder")}
                value={billingDetails.company}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="firstName"
                placeholder={t("stripe-payment.first_name_placeholder")}
                value={billingDetails.firstName}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder={t("stripe-payment.last_name_placeholder")}
                value={billingDetails.lastName}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="address1"
                placeholder={t("stripe-payment.address1_placeholder")}
                value={billingDetails.address1}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="address2"
                placeholder={t("stripe-payment.address2_placeholder")}
                value={billingDetails.address2}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="city"
                placeholder={t("stripe-payment.city_placeholder")}
                value={billingDetails.city}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="postalCode"
                placeholder={t("stripe-payment.postal_code_placeholder")}
                value={billingDetails.postalCode}
                onChange={handleBillingChange}
              />
              <select
                name="countryCode"
                value={billingDetails.countryCode}
                onChange={handleBillingChange}
              >
                {COUNTRIES_AND_CODE.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.country}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="save-billing-button"
                onClick={saveBillingDetails}
              >
                {t("stripe-payment.save_button")}
              </button>
            </div>
          )}
        </div>

        <button
          className="stripe-payment-button"
          onClick={(e) => handlePayment(e, billingDetails.firstName)}
          disabled={loading}
        >
          {loading
            ? t("stripe-payment.processing")
            : t("stripe-payment.proceed_to_purchase")}
        </button>
      </form>
    </div>
  );
};
