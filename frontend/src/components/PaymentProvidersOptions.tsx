import { useGetCart } from "medusa-react";
import { useCallback, useEffect, useState } from "react";
import { StripePayment } from "./StripePayment";
import "./common.css";
import { useParams } from "react-router-dom";

export default function PaymentProvidersOptions() {
  const cartId = useParams().id;
  const { cart } = useGetCart(cartId!);
  const [loading, setLoading] = useState(false);

  const initializePaymentSession = async () => {
    if (!cartId) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:9000/store/carts/${cartId}/payment-sessions`,
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
        throw new Error("Failed to initialize payment session");
      }
    } catch (error) {
      console.error("Error initializing payment session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartId) {
      initializePaymentSession();
    }
  }, [cartId]);

  const getPaymentUi = useCallback(() => {
    const activePaymentSession = cart?.payment_sessions?.[0];
    if (!activePaymentSession) {
      return;
    }

    if (activePaymentSession.provider_id === "stripe") {
      return <StripePayment cartId={cartId!} />;
    }
  }, [cart, cartId]);

  return (
    <div style={{ width: "60%" }}>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {loading ? (
        <p>Chargement du fournisseur de paiement...</p>
      ) : (
        getPaymentUi()
      )}
    </div>
  );
}
