import { useState } from "react";
import CartRecap from "./CartRecap";
import ShippingAddress from "./ShippingAddress";
import ShippingOptions from "./ShippingOptions";
import PaymentProviders from "./PaymentProvidersOptions";
import "./Checkout.css";

export default function Checkout() {
  const cartId = localStorage.getItem("cart_id") || "error";
  const [isAddressUpdated, setIsAddressUpdated] = useState(false);
  const [isShippingOptionsUpdated, setIsShippingOptionsUpdated] =
    useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleAddressUpdateSuccess = () => {
    setIsAddressUpdated(true); // Met à jour l'état lorsque l'adresse est mise à jour avec succès
  };

  const handleShippingOptionsUpdateSuccess = () => {
    setIsShippingOptionsUpdated(true); // Met à jour l'état lorsque les options de livraison sont mises à jour avec succès
  };

  const handlePaymentSuccess = () => {
    setIsPaymentSuccess(true);
  };

  return (
    <div className="checkout">
      {!isAddressUpdated && !isShippingOptionsUpdated && !isPaymentSuccess && (
        <ShippingAddress
          onAddressUpdateSuccess={handleAddressUpdateSuccess}
          cartId={cartId}
        />
      )}
      {isAddressUpdated && !isShippingOptionsUpdated && !isPaymentSuccess && (
        <ShippingOptions
          onShippingOptionsUpdateSuccess={handleShippingOptionsUpdateSuccess}
          cartId={cartId}
        />
      )}
      {isAddressUpdated && isShippingOptionsUpdated && !isPaymentSuccess && (
        <PaymentProviders
          cartId={cartId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      {isAddressUpdated && isShippingOptionsUpdated && isPaymentSuccess && (
        <span>Payment Ok</span>
      )}
      <div className="sidebar">
        <CartRecap />
      </div>
    </div>
  );
}
