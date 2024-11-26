import React, { useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useGetCart } from "medusa-react";
import "./StripePayment.css";
import "./common.css";
import { COUNTRIES_AND_CODE } from "../utils/countries";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_KEY || "temp"
);

export function StripePayment({ cartId }: { cartId: string }) {
  const { cart } = useGetCart(cartId);
  const clientSecret = cart?.payment_sessions?.[0].data.client_secret as string;

  return (
    <div className="stripe-payment-container">
      <h2>How would you like to pay?</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeForm clientSecret={clientSecret} cartId={cartId} />
      </Elements>
    </div>
  );
}

const StripeForm: React.FC<{
  clientSecret?: string;
  cartId: string;
}> = ({ clientSecret, cartId }) => {
  const navigate = useNavigate();
  const { cart } = useGetCart(cartId);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const countryName =
    COUNTRIES_AND_CODE.find(
      (country) => country.code === cart?.shipping_address?.country_code
    )?.country || "Unknown Country";

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
          .then(({ type, cart, error }) => {
            if (type === "cart" && cart) {
              console.error(error);
            } else if (type === "order") {
              alert("Order placed.");
              localStorage.removeItem("cart_id");
              navigate(`/success-order`);
            }
          });
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h3>Payment in full:</h3>
      <div className="payment-choice">
        <label>
          <input type="radio" name="option" value="creditCard" />
          Credit Card
        </label>
      </div>
      <form>
        <label htmlFor="card-element">Enter your credit card details:</label>
        <CardElement id="card-element" className="stripe-card-element" />
        <button
          className="stripe-payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to purchase"}
        </button>
      </form>
      <div className="invoice-address">
        <h4>Invoice address</h4>
        <p>{cart?.shipping_address?.company}</p>
        <p>
          {cart?.shipping_address?.first_name}{" "}
          {cart?.shipping_address?.last_name}
        </p>
        <p>{cart?.shipping_address?.address_1}</p>
        {cart?.shipping_address?.address_2 && (
          <p>{cart?.shipping_address?.address_2}</p>
        )}
        <p>
          {cart?.shipping_address?.postal_code} {cart?.shipping_address?.city}
        </p>
        <p>{countryName}</p>
      </div>
    </>
  );
};
