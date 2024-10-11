import { useState } from "react";
import {
  useAddShippingMethodToCart,
  useCartShippingOptions,
} from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";

interface ShippingOptionsProps {
  onShippingOptionsUpdateSuccess: () => void;
  cartId: string;
}

export default function ShippingOptions({
  onShippingOptionsUpdateSuccess,
  cartId,
}: ShippingOptionsProps) {
  const { shipping_options, isLoading } = useCartShippingOptions(cartId);
  const addShippingMethod = useAddShippingMethodToCart(cartId);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );

  const handleAddShippingMethod = () => {
    if (!selectedOption) {
      return;
    }
    addShippingMethod.mutate(
      {
        option_id: selectedOption,
      },
      {
        onSuccess: ({ cart }) => {
          console.log(cart.shipping_methods);
          onShippingOptionsUpdateSuccess();
        },
      }
    );
  };

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_options && !shipping_options.length && (
        <span>No shipping options</span>
      )}
      {shipping_options && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddShippingMethod();
          }}
        >
          <ul>
            {shipping_options.map((shipping_option) => (
              <li key={shipping_option.id}>
                <label>
                  <input
                    type="radio"
                    name="shipping_option"
                    value={shipping_option.id}
                    checked={selectedOption === shipping_option.id}
                    onChange={() => setSelectedOption(shipping_option.id)}
                  />
                  {shipping_option.name}{" "}
                  {getFormattedPrice(shipping_option.amount!)}
                </label>
              </li>
            ))}
          </ul>
          <button type="submit" disabled={!selectedOption}>
            Confirmer l'option de livraison
          </button>
        </form>
      )}
    </div>
  );
}
