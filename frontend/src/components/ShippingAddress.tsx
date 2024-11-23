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

  const [address, setAddress] = useState({
    company: "",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    country_code: "",
    province: "",
    postal_code: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(address);
    e.preventDefault();
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
          onAddressUpdateSuccess();
        },
        onError: (error) => {
          console.error(
            "Erreur lors de la mise à jour de l'adresse de livraison.",
            error
          );
        },
      }
    );
  };

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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="city">Ville</label>*
          <input
            id="city"
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="country_code">Country</label>*
          <select
            id="country_code"
            name="country_code"
            value={address.country_code}
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="use format +33"
          />
        </div>
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
}
