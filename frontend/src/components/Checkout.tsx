import { useState } from "react";
import CartRecap from "./CartRecap";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { useCartHomeMade } from "../CartContext";

export default function Checkout() {
  console.log("chargement checkout...");
  const navigate = useNavigate();
  const { cartId } = useCartHomeMade();
  const [isAddressUpdated, setIsAddressUpdated] = useState(false);
  const [isShippingOptionsUpdated, setIsShippingOptionsUpdated] =
    useState(false);

  const handleAddressUpdateSuccess = () => {
    setIsAddressUpdated(true); // Met à jour l'état lorsque l'adresse est mise à jour avec succès
  };

  const handleShippingOptionsUpdateSuccess = () => {
    setIsShippingOptionsUpdated(true); // Met à jour l'état lorsque les options de livraison sont mises à jour avec succès
    navigate("/payment/" + cartId); // Redirige l'utilisateur vers la page de paiement
  };

  if (!cartId) {
    // Affiche une indication de chargement pendant que cartId est en train d'être récupéré
    return <p>Chargement...</p>;
  }

  return (
    <>
      <div className="separator"></div>
      <div className="checkout">
        {!isAddressUpdated && !isShippingOptionsUpdated && (
          <ShippingAddress
            onAddressUpdateSuccess={handleAddressUpdateSuccess}
            cartId={cartId}
          />
        )}
        {isAddressUpdated && !isShippingOptionsUpdated && (
          <ShippingOptions
            onShippingOptionsUpdateSuccess={handleShippingOptionsUpdateSuccess}
            cartId={cartId}
          />
        )}
        <div className="sidebar">
          <CartRecap />
        </div>
      </div>
    </>
  );
}
