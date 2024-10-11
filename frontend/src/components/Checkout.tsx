import { useState } from "react";
import CartRecap from "./CartRecap";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";

export default function Checkout() {
  const cartId = localStorage.getItem("cart_id") || "error";
  const [isAddressUpdated, setIsAddressUpdated] = useState(false);
  const [isShippingOptionsUpdated, setIsShippingOptionsUpdated] =
    useState(false);

  const handleAddressUpdateSuccess = () => {
    setIsAddressUpdated(true); // Met à jour l'état lorsque l'adresse est mise à jour avec succès
  };

  const handleShippingOptionsUpdateSuccess = () => {
    setIsShippingOptionsUpdated(true); // Met à jour l'état lorsque les options de livraison sont mises à jour avec succès
  };

  return (
    <div>
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
      {isAddressUpdated && isShippingOptionsUpdated && <span>Payment</span>}
      <CartRecap />
    </div>
  );
}
