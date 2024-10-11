import { useGetCart } from "medusa-react";
import { useEffect, useState } from "react";

export default function CartRecap() {
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart, isLoading, error } = useGetCart(cartId);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      setTotalPrice(cartTotal);
    }
  }, [cart?.items]);

  if (cartId === "error") {
    return <div>Erreur: aucun panier trouvé.</div>;
  }

  if (isLoading) {
    return <div>Chargement du panier...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement du panier.</div>;
  }

  return (
    <div
      style={{
        position: "fixed", // La box reste fixe même en scrollant
        top: "20px", // Distance par rapport au haut de l'écran
        right: "20px", // Distance par rapport au côté droit
        width: "300px", // Largeur de la box
        padding: "20px", // Un peu d'espace intérieur
        backgroundColor: "#f9f9f9", // Couleur de fond
        border: "1px solid #ccc", // Bordure grise claire
        borderRadius: "10px", // Coins arrondis
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ombre pour un effet 3D léger
      }}
    >
      <h2>Récapitulatif du Panier</h2>
      {cart && cart.items && cart.items.length > 0 ? (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                <div>
                  <p>Produit: {item.title}</p>
                  <p>Quantité: {item.quantity}</p>
                  <p>
                    Prix: {(item.unit_price / 100).toFixed(2)}{" "}
                    {cart.region.currency_code.toUpperCase()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p>
              <strong>Total:</strong> {(totalPrice / 100).toFixed(2)}{" "}
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
