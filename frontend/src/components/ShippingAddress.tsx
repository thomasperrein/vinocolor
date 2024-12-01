import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateCart } from "medusa-react";
import "./ShippingAddress.css";
import "./common.css";
import { COUNTRIES_AND_CODE } from "../utils/countries";

interface ShippingAddressProps {
  onAddressUpdateSuccess: () => void;
  cartId: string;
}

function ShippingAddress({
  onAddressUpdateSuccess,
  cartId,
}: ShippingAddressProps) {
  const { t } = useTranslation();
  const updateCart = useUpdateCart(cartId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState({
    company: "",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    country_code: "fr",
    province: "",
    postal_code: "",
    phone: "",
  });

  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleChangeAddress = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCustomer = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Récupération du token admin
      const password = import.meta.env.VITE_PASSWORD_CUSTOMER;
      const email = import.meta.env.VITE_EMAIL_SUPERUSER;

      const tokenResponse = await fetch(
        `${import.meta.env.VITE_REACT_APP_MEDUSA_API_URL}/admin/auth/token`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error("Erreur lors de la récupération du token");
      }

      const { access_token } = await tokenResponse.json();

      // Récupérer ou créer le client
      const customerPromise = (async () => {
        let customerId: string | undefined;

        const findCustomerResponse = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_MEDUSA_API_URL
          }/admin/customers?limit=1&q=${customer.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (findCustomerResponse.ok) {
          const { customers } = await findCustomerResponse.json();
          if (customers.length > 0) {
            customerId = customers[0].id;
          }
        }

        if (!customerId) {
          const createCustomerResponse = await fetch(
            `${import.meta.env.VITE_REACT_APP_MEDUSA_API_URL}/admin/customers`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify({
                first_name: customer.first_name,
                last_name: customer.last_name,
                email: customer.email,
                password,
                metadata: { origin: "created from code" },
              }),
            }
          );

          if (!createCustomerResponse.ok) {
            throw new Error("Erreur lors de la création du client");
          }

          const { customer: customerCreated } =
            await createCustomerResponse.json();
          customerId = customerCreated.id;
        }

        return customerId;
      })();

      // Mise à jour du panier
      const cartPromise = customerPromise.then(async (customerId) => {
        const cartResponse = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_MEDUSA_API_URL
          }/store/carts/${cartId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key":
                import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY ||
                "temp",
            },
            body: JSON.stringify({
              customer_id: customerId,
            }),
          }
        );

        if (!cartResponse.ok) {
          throw new Error("Erreur lors de la mise à jour du panier");
        }

        return true;
      });

      // Mise à jour de l'adresse
      const addressPromise = new Promise<void>((resolve, reject) => {
        updateCart.mutate(
          {
            shipping_address: {
              company: address.company,
              first_name: address.first_name,
              last_name: address.last_name,
              address_1: address.address_1,
              address_2: address.address_2,
              city: address.city,
              country_code: address.country_code,
              province: address.province,
              postal_code: address.postal_code,
              phone: address.phone,
            },
          },
          {
            onSuccess: () => {
              resolve();
            },
            onError: (error) => {
              console.error(
                "Erreur lors de la mise à jour de l'adresse de livraison.",
                error
              );
              reject(error);
            },
          }
        );
      });

      // Attendre que toutes les promesses soient terminées
      const [customerResult, cartResult] = await Promise.all([
        customerPromise,
        cartPromise,
        addressPromise,
      ]);

      // Si toutes les étapes réussissent
      if (customerResult && cartResult) {
        onAddressUpdateSuccess();
      }
    } catch (error) {
      console.error("Une erreur est survenue :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shipping-address">
      {isSubmitting && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h2>{t("shipping-address.title")}</h2>
      <h3>{t("shipping-address.subtitle")}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="company">{t("shipping-address.company")}</label>
          <input
            id="company"
            type="text"
            name="company"
            value={address.company}
            onChange={handleChangeAddress}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="first_name">{t("shipping-address.first_name")}</label>
          *
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={address.first_name}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="last_name">{t("shipping-address.last_name")}</label>*
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={address.last_name}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="address_1">{t("shipping-address.address_1")}</label>*
          <input
            id="address_1"
            type="text"
            name="address_1"
            value={address.address_1}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="address_2">{t("shipping-address.address_2")}</label>
          <input
            id="address_2"
            type="text"
            name="address_2"
            value={address.address_2}
            onChange={handleChangeAddress}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="city">{t("shipping-address.city")}</label>*
          <input
            id="city"
            type="text"
            name="city"
            value={address.city}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="postal_code">
            {t("shipping-address.postal_code")}
          </label>
          *
          <input
            id="postal_code"
            type="text"
            name="postal_code"
            value={address.postal_code}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="country_code">{t("shipping-address.country")}</label>*
          <select
            id="country_code"
            name="country_code"
            value={address.country_code}
            onChange={handleChangeAddress}
            required
          >
            {COUNTRIES_AND_CODE.map((country) => (
              <option key={country.code} value={country.code}>
                {country.country}
              </option>
            ))}
          </select>
        </div>
        <div className="input-wrapper">
          <label htmlFor="phone">{t("shipping-address.phone")}</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={address.phone}
            onChange={handleChangeAddress}
            placeholder={t("shipping-address.phone_placeholder")}
          />
        </div>
        <h3>{t("shipping-address.contact_details")}</h3>
        <div className="input-wrapper">
          <label htmlFor="first_name">{t("shipping-address.first_name")}</label>
          *
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={customer.first_name}
            onChange={handleChangeCustomer}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="last_name">{t("shipping-address.last_name")}</label>*
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={customer.last_name}
            onChange={handleChangeCustomer}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="email">{t("shipping-address.email")}</label>*
          <input
            id="email"
            type="text"
            name="email"
            value={customer.email}
            onChange={handleChangeCustomer}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("shipping-address.submitting")
            : t("shipping-address.proceed_to_payment")}
        </button>
      </form>
    </div>
  );
}

export default React.memo(ShippingAddress);
