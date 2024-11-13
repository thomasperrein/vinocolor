import { useGetCart } from "medusa-react";
import { useCallback, useEffect, useState } from "react";
import StripePayment from "./StripePayment";

interface PaymentProvidersOptionsProps {
  cartId: string;
  onPaymentSuccess: () => void;
}

export type PaymentProvider = {
  id: string;
};

export default function PaymentProvidersOptions({
  cartId,
  onPaymentSuccess,
}: PaymentProvidersOptionsProps) {
  const { cart } = useGetCart(cartId);
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>(
    []
  );
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("cart", cart);
    if (!cart) {
      return;
    }

    fetch(`http://localhost:9000/store/regions/${cart.region_id}`, {
      credentials: "include",
      headers: {
        "x-publishable-api-key": import.meta.env
          .REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setPaymentProviders(res.region.payment_providers);
        setSelectedPaymentProvider(res.region.payment_providers[0].id);
      });
  }, [cart]);

  const handleSelectProvider = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!cart || !selectedPaymentProvider) {
      return;
    }

    setLoading(false);

    // initialize payment session
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
          provider_id: selectedPaymentProvider,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  };

  const getPaymentUi = useCallback(() => {
    const activePaymentSession = cart?.payment_sessions?.[0];
    if (!activePaymentSession) {
      return;
    }
    console.log("activePaymentSession", activePaymentSession);

    switch (true) {
      case activePaymentSession.provider_id === "stripe":
        return (
          <StripePayment cartId={cartId} onPaymentSuccess={onPaymentSuccess} />
        );
    }
  }, [cart, cartId]);

  return (
    <div>
      <form>
        <select
          value={selectedPaymentProvider}
          onChange={(e) => setSelectedPaymentProvider(e.target.value)}
        >
          {paymentProviders.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.id}
            </option>
          ))}
        </select>
        <button
          disabled={loading}
          onClick={async (e) => {
            await handleSelectProvider(e);
          }}
        >
          Submit
        </button>
      </form>
      {getPaymentUi()}
    </div>
  );
}
