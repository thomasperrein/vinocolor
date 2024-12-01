import { useState } from "react";
import CartRecap from "./CartRecap";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { useCartHomeMade } from "../CartContext";
import { useTranslation } from "react-i18next";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartIdState, cart, isLoading, error } = useCartHomeMade();
  const [isAddressUpdated, setIsAddressUpdated] = useState(false);
  const [isShippingOptionsUpdated, setIsShippingOptionsUpdated] =
    useState(false);

  const { t } = useTranslation();

  const handleAddressUpdateSuccess = () => {
    setIsAddressUpdated(true); // Met à jour l'état lorsque l'adresse est mise à jour avec succès
  };

  const handleShippingOptionsUpdateSuccess = () => {
    setIsShippingOptionsUpdated(true); // Met à jour l'état lorsque les options de livraison sont mises à jour avec succès
    navigate("/payment"); // Redirige l'utilisateur vers la page de paiement
  };

  if (!cartIdState) {
    // Affiche une indication de chargement pendant que cartId est en train d'être récupéré
    return <p>{t("checkout.loading")}</p>;
  }

  return (
    <>
      <div className="separator"></div>
      <div className="checkout">
        {!isAddressUpdated && !isShippingOptionsUpdated && (
          <ShippingAddress
            onAddressUpdateSuccess={handleAddressUpdateSuccess}
            cartId={cartIdState}
          />
        )}
        {isAddressUpdated && !isShippingOptionsUpdated && (
          <ShippingOptions
            onShippingOptionsUpdateSuccess={handleShippingOptionsUpdateSuccess}
            cartId={cartIdState}
          />
        )}
        <div className="sidebar">
          <CartRecap
            cart={cart}
            isLoading={isLoading}
            error={error}
            cartIdState={cartIdState}
          />
        </div>
      </div>
    </>
  );
}
