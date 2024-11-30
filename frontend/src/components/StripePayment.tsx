import React, { useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./StripePayment.css";
import "./common.css";
import { COUNTRIES_AND_CODE } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { useCartHomeMade } from "../CartContext";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_KEY || "temp"
);

export function StripePayment() {
  return (
    <div className="stripe-payment-container">
      <h2>How would you like to pay?</h2>
      <Elements stripe={stripePromise}>
        <StripeForm />
      </Elements>
    </div>
  );
}

const StripeForm: React.FC = () => {
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
        `http://localhost:9000/store/carts/${cartIdState}`,
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
        throw new Error("Failed to update billing address");
      }
    } catch (error) {
      console.error("Error updating billing address:", error);
    } finally {
      setLoading(false);
      setEditingBilling(false);
    }
  };

  async function handlePayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const card = elements?.getElement(CardElement);

    if (!stripe || !elements || !card || !cart || !clientSecret) {
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
          `http://localhost:9000/store/carts/${cartIdState}/complete`,
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
          .then(({ type, cart, error }) => {
            if (type === "cart" && cart) {
              console.error(error);
            } else if (type === "order") {
              handleCartIdChange(undefined);
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
      <h3>Payment in full:</h3>
      <div className="payment-choice">
        <label>
          <input type="radio" name="option" value="creditCard" />
          Credit Card
        </label>
      </div>
      <form>
        <label htmlFor="card-element">Enter your credit card details:</label>
        <CardElement id="card-element" className="stripe-card-element" />

        <div className="invoice-address">
          <h4>Invoice Address</h4>
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
                Edit
              </button>
            </div>
          ) : (
            <div className="billing-address-form">
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={billingDetails.company}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={billingDetails.firstName}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={billingDetails.lastName}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="address1"
                placeholder="Address Line 1"
                value={billingDetails.address1}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2"
                value={billingDetails.address2}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={billingDetails.city}
                onChange={handleBillingChange}
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
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
                Save
              </button>
            </div>
          )}
        </div>

        <button
          className="stripe-payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to purchase"}
        </button>
      </form>
    </div>
  );
};
