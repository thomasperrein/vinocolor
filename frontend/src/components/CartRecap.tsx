import { useEffect, useState } from "react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import "./CartRecap.css";
import { useCartHomeMade } from "../CartContext";

export default function CartRecap() {
  const { cart, cartIdState, isLoading, error, reloadTrigger } =
    useCartHomeMade();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const shippingTotal = cart?.shipping_total || 0;
      setTotalPrice(cartTotal + shippingTotal);
    }
  }, [cart?.items, cart?.shipping_total, reloadTrigger]);

  if (cartIdState === "error") {
    return <div>Erreur: aucun panier trouvé.</div>;
  }

  if (isLoading) {
    return <div>Chargement du panier...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement du panier.</div>;
  }

  return (
    <div className="cart-recap">
      <h2>Récapitulatif du Panier</h2>
      {cart && cart.items && cart.items.length > 0 ? (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <p>Produit: {item.title}</p>
                <p>Quantité: {item.quantity}</p>
                <p>
                  Prix: {(item.unit_price / 100).toFixed(2)}{" "}
                  {cart.region.currency_code.toUpperCase()}
                </p>
              </li>
            ))}
          </ul>
          <div className="total">
            <p>
              <strong>Livraison:</strong>{" "}
              {getFormattedPrice(cart.shipping_total!)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
            <p>
              <strong>Total:</strong> {getFormattedPrice(totalPrice)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        <div>Votre panier est vide.</div>
      )}
    </div>
  );
}
