import { useState } from "react";
import { useUpdateCart } from "medusa-react";

export default function ShippingAddress() {
  const cartId = localStorage.getItem("cart_id") || "error";
  const updateCart = useUpdateCart(cartId);

  const [address, setAddress] = useState({
    company: "",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    country_code: "FR", // Par défaut France, ajustez si besoin
    province: "",
    postal_code: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        },
        onError: (error) => {
          console.log(error);
          console.error(
            "Erreur lors de la mise à jour de l'adresse de livraison."
          );
        },
      }
    );
  };

  return (
    <div>
      <h2>Adresse de Livraison</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            name="first_name"
            value={address.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="last_name"
            value={address.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresse 1</label>
          <input
            type="text"
            name="address_1"
            value={address.address_1}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresse 2</label>
          <input
            type="text"
            name="address_2"
            value={address.address_2}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Ville</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Code Postal</label>
          <input
            type="text"
            name="postal_code"
            value={address.postal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pays</label>
          <input
            type="text"
            name="country_code"
            value={address.country_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="text"
            name="phone"
            value={address.phone}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Définir l'adresse de livraison</button>
      </form>
    </div>
  );
}
