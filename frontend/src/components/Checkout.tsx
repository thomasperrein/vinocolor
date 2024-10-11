import CartRecap from "./CartRecap";
import ShippingAddress from "./ShippingAddress";

export default function Checkout() {
  return (
    <div>
      <ShippingAddress />
      <CartRecap />
    </div>
  );
}
