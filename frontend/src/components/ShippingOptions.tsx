import { useState } from "react";
import {
  useAddShippingMethodToCart,
  useCartShippingOptions,
} from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import "./ShippingOptions.css";

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
      { option_id: selectedOption },
      {
        onSuccess: () => {
          onShippingOptionsUpdateSuccess();
        },
      }
    );
  };

  return (
    <div className="shipping-options">
      <h2>Choisissez votre méthode de livraison</h2>
      {isLoading && <span>Chargement...</span>}
      {shipping_options && !shipping_options.length && (
        <span>Aucune option de livraison disponible</span>
      )}
      {shipping_options && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddShippingMethod();
          }}
        >
          <ul>
            {shipping_options.map((option) => (
              <li key={option.id}>
                <label>
                  <input
                    type="radio"
                    name="shipping_option"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  {option.name} - {getFormattedPrice(option.amount!)}
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
