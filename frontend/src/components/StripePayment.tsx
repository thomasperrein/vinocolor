import React, { useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useGetCart } from "medusa-react";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_KEY || "temp"
);

export function StripePayment({
  cartId,
  onPaymentSuccess,
}: {
  cartId: string;
  onPaymentSuccess: () => void;
}) {
  const { cart } = useGetCart(cartId);
  const clientSecret = cart?.payment_sessions?.[0].data.client_secret as string;

  return (
    <div>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeForm
          clientSecret={clientSecret}
          cartId={cartId}
          onPaymentSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  );
}

const StripeForm: React.FC<{
  clientSecret?: string;
  cartId: string;
  onPaymentSuccess: () => void;
}> = ({ clientSecret, cartId, onPaymentSuccess }) => {
  const { cart } = useGetCart(cartId);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  async function handlePayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const card = elements?.getElement(CardElement);

    if (!stripe || !elements || !card || !cart || !clientSecret) {
      return;
    }

    setLoading(true);
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: cart.shipping_address?.first_name,
            email: cart.email,
            phone: cart.shipping_address?.phone,
            address: {
              city: cart.shipping_address?.city,
              country: cart.shipping_address?.country_code,
              line1: cart.shipping_address?.address_1,
              line2: cart.shipping_address?.address_2,
              postal_code: cart.shipping_address?.postal_code,
            },
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error(error);
          return;
        }
        fetch(`http://localhost:9000/store/carts/${cartId}/complete`, {
          method: "POST",
          credentials: "include",
          headers: {
            "x-publishable-api-key": import.meta.env
              .VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
          },
          body: JSON.stringify({}),
        })
          .then((res) => res.json())
          .then(({ type, cart, order, error }) => {
            if (type === "cart" && cart) {
              console.error(error);
            } else if (type === "order" && order) {
              alert("Order placed.");
              onPaymentSuccess();
            }
          });
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
        <h1>TEST</h1>
      </div>
      <form>
        <CardElement />
        <button onClick={handlePayment} disabled={loading}>
          Place Order
        </button>
      </form>
    </>
  );
};

export default StripePayment;
