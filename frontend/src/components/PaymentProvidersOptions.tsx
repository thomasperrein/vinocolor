import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StripePayment } from "./StripePayment";
import "./common.css";
import { useCartHomeMade } from "../CartContext";
import CartRecap from "./CartRecap";

export default function PaymentProvidersOptions() {
  const { t } = useTranslation();
  const {
    cart,
    cartIdState,
    activePaymentSession,
    isLoading,
    error,
    reloadTrigger,
  } = useCartHomeMade(); // Ajout de refetch
  const [loading, setLoading] = useState(false);
  const [errorString, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false); // Pour déclencher l'affichage de StripePayment
  const initialized = useRef(false); // Persistant entre les re-renders

  const initializePaymentSession = async () => {
    if (loading || initialized.current) return; // Empêche plusieurs initialisations

    try {
      setLoading(true);
      setError(""); // Réinitialise les erreurs avant un nouvel appel

      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_MEDUSA_API_URL
        }/store/carts/${cartIdState}/payment-sessions`,
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
          throw new Error(t("payment-providers-options.error_message"));
        }
      }

      initialized.current = true; // Marque comme initialisé
      setIsInitialized(true); // Déclenche l’affichage de StripePayment
    } catch (error) {
      console.error("Error initializing payment session:", error);
      setError(t("payment-providers-options.error_message"));
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
  }, [activePaymentSession, reloadTrigger]); // Se déclenche seulement quand `activePaymentSession` change

  return (
    <div style={{ width: "100%", display: "flex" }}>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {errorString && (
        <p style={{ color: "red" }}>
          {t("payment-providers-options.error_display")} {errorString}
        </p>
      )}
      {isInitialized && <StripePayment />}
      {!loading && !isInitialized && !errorString && (
        <p>{t("payment-providers-options.initializing_session")}</p>
      )}
      <div style={{ width: "40%" }}>
        <CartRecap
          cart={cart}
          isLoading={isLoading}
          cartIdState={cartIdState}
          error={error}
        />
      </div>
    </div>
  );
}
