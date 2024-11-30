import React, { useState } from "react";
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
        `http://localhost:9000/admin/auth/token`,
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
          `http://localhost:9000/admin/customers?limit=1&q=${customer.email}`,
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
            `http://localhost:9000/admin/customers`,
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
          `http://localhost:9000/store/carts/${cartId}`,
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
      <h2>Where we have to send your order?</h2>
      <h3>Enter your name and address:</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="company" className="floating-label">
            Company
          </label>
          <input
            id="company"
            type="text"
            name="company"
            value={address.company}
            onChange={handleChangeAddress}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="first_name" className="floating-label">
            Prénom
          </label>
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
          <label htmlFor="last_name">Nom</label>*
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
          <label htmlFor="address_1">Adresse 1</label>*
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
          <label htmlFor="address_2">Adresse 2</label>
          <input
            id="address_2"
            type="text"
            name="address_2"
            value={address.address_2}
            onChange={handleChangeAddress}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="city">Ville</label>*
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
          <label htmlFor="postal_code">Code Postal</label>*
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
          <label htmlFor="country_code">Country</label>*
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
          <label htmlFor="phone" className="floating-label">
            Téléphone
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={address.phone}
            onChange={handleChangeAddress}
            placeholder="use format +33"
          />
        </div>
        <h3>What are your contact details ?</h3>
        <div className="input-wrapper">
          <label htmlFor="first_name" className="floating-label">
            Prénom
          </label>
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
          <label htmlFor="last_name">Nom</label>*
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
          <label htmlFor="email">Email</label>*
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
          {isSubmitting ? "Submitting..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

export default React.memo(ShippingAddress);
