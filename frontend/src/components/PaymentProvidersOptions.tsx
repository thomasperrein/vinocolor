import { useState, useEffect, useRef } from "react";
import { StripePayment } from "./StripePayment";
import "./common.css";
import { useCartHomeMade } from "../CartContext";
import CartRecap from "./CartRecap";

export default function PaymentProvidersOptions() {
  const { cartIdState, activePaymentSession } = useCartHomeMade();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false); // Pour déclencher l'affichage de StripePayment
  const initialized = useRef(false); // Persistant entre les re-renders

  const initializePaymentSession = async () => {
    if (loading || initialized.current) return; // Empêche plusieurs initialisations

    try {
      setLoading(true);
      setError(""); // Réinitialise les erreurs avant un nouvel appel

      const response = await fetch(
        `http://localhost:9000/store/carts/${cartIdState}/payment-sessions`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env
              .VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
          },
          body: JSON.stringify({
            provider_id: "stripe",
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          console.error("Payment session already initialized");
          initialized.current = true; // Marque comme initialisé
          setIsInitialized(true);
        } else {
          throw new Error("Failed to initialize payment session");
        }
      }

      initialized.current = true; // Marque comme initialisé
      setIsInitialized(true); // Déclenche l’affichage de StripePayment
    } catch (error) {
      console.error("Error initializing payment session:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activePaymentSession && !initialized.current) {
      initializePaymentSession();
    } else if (activePaymentSession) {
      setIsInitialized(true); // Si `activePaymentSession` est déjà défini
    }
  }, [activePaymentSession]); // Se déclenche seulement quand `activePaymentSession` change

  return (
    <div style={{ width: "100%", display: "flex" }}>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {isInitialized && <StripePayment />}
      {!loading && !isInitialized && !error && (
        <p>Initializing payment session...</p>
      )}
      <div style={{ width: "40%" }}>
        <CartRecap />
      </div>
    </div>
  );
}
