import { useGetCart } from "medusa-react";
import { useCallback, useEffect, useState } from "react";
import { StripePayment } from "./StripePayment";

interface PaymentProvidersOptionsProps {
  cartId: string;
  onPaymentSuccess: () => void;
}

export default function PaymentProvidersOptions({
  cartId,
  onPaymentSuccess,
}: PaymentProvidersOptionsProps) {
  const { cart } = useGetCart(cartId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart) {
      return;
    }
    const initializePaymentSession = async () => {
      try {
        setLoading(true);
        await fetch(
          `http://localhost:9000/store/carts/${cartId}/payment-sessions`,
          {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": import.meta.env
                .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              provider_id: "stripe",
            }),
          }
        );
      } catch (error) {
        console.error("Error initializing payment session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePaymentSession();
  }, [cartId]);

  const getPaymentUi = useCallback(() => {
    const activePaymentSession = cart?.payment_sessions?.[0];
    if (!activePaymentSession) {
      return;
    }

    if (activePaymentSession.provider_id === "stripe") {
      return (
        <StripePayment cartId={cartId} onPaymentSuccess={onPaymentSuccess} />
      );
    }
  }, [cartId]);

  return (
    <div style={{ width: "60%" }}>
      {loading ? (
        <p>Chargement du fournisseur de paiement...</p>
      ) : (
        getPaymentUi()
      )}
    </div>
  );
}
