import { useState } from "react";
import { useUpdateCart } from "medusa-react";
import "./ShippingAddress.css";
import { COUNTRIES_AND_CODE } from "../utils/countries";

interface ShippingAddressProps {
  onAddressUpdateSuccess: () => void;
  cartId: string;
}

export default function ShippingAddress({
  onAddressUpdateSuccess,
  cartId,
}: ShippingAddressProps) {
  const updateCart = useUpdateCart(cartId);
  const [isFormAddressSuccess, setIsFormAddressSuccess] = useState(false);
  const [isFormCustomerSuccess, setIsFormCustomerSuccess] = useState(false);

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
      console.log("Access Token:", access_token);

      // Essayer de récupérer le client avec son email
      let customerId;
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
          console.log("Client existant trouvé :", customers[0]);
        }
      }

      // Si le client n'existe pas, le créer
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
              password: import.meta.env.VITE_PASSWORD_CUSTOMER,
              metadata: { origin: "created from code" },
            }),
          }
        );

        if (!createCustomerResponse.ok) {
          throw new Error("Erreur lors de la création du client");
        }

        const { customerCreated } = await createCustomerResponse.json();
        customerId = customerCreated.id;
        console.log("Nouveau client créé :", customerCreated);
      }

      // Mise à jour du panier avec le client
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
      } else {
        setIsFormCustomerSuccess(true);
      }

      const { cartAffected } = await cartResponse.json();
      console.log("Panier mis à jour :", cartAffected);

      // Mise à jour de l'adresse de livraison
      await new Promise<void>((resolve, reject) => {
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
              console.log("Adresse de livraison mise à jour avec succès !");
              setIsFormAddressSuccess(true);
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
    } catch (error) {
      console.error("Une erreur est survenue :", error);
    } finally {
      setIsSubmitting(false);
      console.log(isFormAddressSuccess, isFormCustomerSuccess);
      if (isFormAddressSuccess && isFormCustomerSuccess) {
        onAddressUpdateSuccess();
      }
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   try {
  //     // Mise à jour de l'adresse de livraison
  //     await new Promise<void>((resolve, reject) => {
  //       updateCart.mutate(
  //         {
  //           shipping_address: {
  //             company: address.company,
  //             first_name: address.first_name,
  //             last_name: address.last_name,
  //             address_1: address.address_1,
  //             address_2: address.address_2,
  //             city: address.city,
  //             country_code: address.country_code,
  //             province: address.province,
  //             postal_code: address.postal_code,
  //             phone: address.phone,
  //           },
  //         },
  //         {
  //           onSuccess: () => {
  //             console.log("Adresse de livraison mise à jour avec succès !");
  //             setIsFormAddressSuccess(true);
  //             resolve();
  //           },
  //           onError: (error) => {
  //             console.error(
  //               "Erreur lors de la mise à jour de l'adresse de livraison.",
  //               error
  //             );
  //             reject(error);
  //           },
  //         }
  //       );
  //     });

  //     // Récupération du token d'authentification
  //     const password = import.meta.env.VITE_PASSWORD_CUSTOMER;
  //     const email = import.meta.env.VITE_EMAIL_SUPERUSER;
  //     const tokenResponse = await fetch(
  //       `http://localhost:9000/admin/auth/token`,
  //       {
  //         credentials: "include",
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //           password,
  //         }),
  //       }
  //     );

  //     if (!tokenResponse.ok) {
  //       throw new Error("Erreur lors de la récupération du token");
  //     }

  //     const { access_token } = await tokenResponse.json();
  //     console.log("Access Token:", access_token);

  //     // Création du client
  //     const customerResponse = await fetch(
  //       `http://localhost:9000/admin/customers`,
  //       {
  //         credentials: "include",
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${access_token}`,
  //           "x-publishable-api-key":
  //             import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY ||
  //             "temp",
  //         },
  //         body: JSON.stringify({
  //           first_name: customer.first_name,
  //           last_name: customer.last_name,
  //           email: customer.email,
  //           password: import.meta.env.VITE_PASSWORD_CUSTOMER,
  //           metadata: { origin: "created from code" },
  //         }),
  //       }
  //     );

  //     if (!customerResponse.ok) {
  //       throw new Error("Erreur lors de la création du client");
  //     }

  //     const { customerCreated } = await customerResponse.json();
  //     console.log("Client créé:", customerCreated);

  //     // Mise à jour du panier avec le client
  //     const cartResponse = await fetch(`/store/carts/${cartId}`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-publishable-api-key":
  //           import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY || "temp",
  //       },
  //       body: JSON.stringify({
  //         customer_id: customerCreated.id,
  //       }),
  //     });

  //     if (!cartResponse.ok) {
  //       throw new Error("Erreur lors de la mise à jour du panier");
  //     }

  //     const { cartAffected } = await cartResponse.json();
  //     console.log("Panier mis à jour:", cartAffected);

  //     if (customerCreated.id && cartAffected.cart.customer_id) {
  //       localStorage.setItem("customer_id", customerCreated.id);
  //       setIsFormCustomerSuccess(true);
  //     } else {
  //       throw new Error("Erreur lors de la liaison client-panier");
  //     }

  //     // Vérification des succès
  //     if (isFormAddressSuccess && isFormCustomerSuccess) {
  //       console.log("Toutes les étapes ont été exécutées avec succès.");
  //       onAddressUpdateSuccess();
  //     }
  //   } catch (error) {
  //     console.error("Une erreur est survenue :", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   updateCart.mutate(
  //     {
  //       shipping_address: {
  //         company: address.company,
  //         first_name: address.first_name,
  //         last_name: address.last_name,
  //         address_1: address.address_1,
  //         address_2: address.address_2,
  //         city: address.city,
  //         country_code: address.country_code,
  //         province: address.province,
  //         postal_code: address.postal_code,
  //         phone: address.phone,
  //       },
  //     },
  //     {
  //       onSuccess: () => {
  //         console.log("Adresse de livraison mise à jour avec succès !");
  //         setIsFormAddressSuccess(true);
  //       },
  //       onError: (error) => {
  //         console.error(
  //           "Erreur lors de la mise à jour de l'adresse de livraison.",
  //           error
  //         );
  //       },
  //     }
  //   );
  //   const password = import.meta.env.VITE_PASSWORD_CUSTOMER;
  //   const email = import.meta.env.VITE_EMAIL_SUPERUSER;
  //   e.preventDefault();
  //   const { access_token } = await fetch(
  //     `http://localhost:9000/admin/auth/token`,
  //     {
  //       credentials: "include",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         password: password,
  //       }),
  //     }
  //   ).then((res) => res.json());

  //   const { customerCreated } = await fetch(
  //     `http://localhost:9000/admin/customers`,
  //     {
  //       credentials: "include",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${access_token}`,
  //         "x-publishable-api-key":
  //           import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY || "temp",
  //       },
  //       body: JSON.stringify({
  //         first_name: customer.first_name,
  //         last_name: customer.last_name,
  //         email: customer.email,
  //         password: import.meta.env.VITE_PASSWORD_CUSTOMER,
  //         metadata: { origin: "created from code" },
  //       }),
  //     }
  //   ).then((res) => res.json());

  //   const { cartAffected } = await fetch(`/store/carts/${cartId}`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-publishable-api-key":
  //         import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY || "temp",
  //     },
  //     body: JSON.stringify({
  //       customer_id: customerCreated.id,
  //     }),
  //   }).then((res) => res.json());
  //   console.log(access_token);
  //   console.log(customerCreated);
  //   console.log(cartAffected);
  //   if (customerCreated.id && cartAffected.cart.customer_id) {
  //     localStorage.setItem("customer_id", customerCreated.id);
  //     setIsFormCustomerSuccess(true);
  //   } else {
  //     console.error("Erreur lors de la création du client.");
  //   }
  //   if (isFormAddressSuccess && isFormCustomerSuccess) {
  //     setIsSubmitting(false);
  //     onAddressUpdateSuccess();
  //   }
  // };

  return (
    <div className="shipping-address">
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
