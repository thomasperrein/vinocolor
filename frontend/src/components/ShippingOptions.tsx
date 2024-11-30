import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddShippingMethodToCart,
  useCartShippingOptions,
} from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import "./ShippingOptions.css";
import "./common.css";
import { useCartHomeMade } from "../CartContext";

interface ShippingOptionsProps {
  onShippingOptionsUpdateSuccess: () => void;
  cartId: string;
}

export default function ShippingOptions({
  onShippingOptionsUpdateSuccess,
  cartId,
}: ShippingOptionsProps) {
  const { t } = useTranslation();
  const { shipping_options, isLoading } = useCartShippingOptions(cartId);
  const addShippingMethod = useAddShippingMethodToCart(cartId);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { triggerReload } = useCartHomeMade();

  const handleAddShippingMethod = () => {
    setIsSubmitting(true);
    if (!selectedOption) {
      setIsSubmitting(false);
      return;
    }
    addShippingMethod.mutate(
      { option_id: selectedOption },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          triggerReload();
        },
      }
    );
  };

  return (
    <div className="shipping-options">
      {isSubmitting ||
        (isLoading && (
          <div className="loader-overlay">
            <div className="loader"></div>
          </div>
        ))}
      <h2>{t("shipping-options.title")}</h2>
      {shipping_options && !shipping_options.length && (
        <span>{t("shipping-options.no_options")}</span>
      )}
      {shipping_options && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onShippingOptionsUpdateSuccess();
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
                    onChange={() => {
                      setSelectedOption(option.id);
                      handleAddShippingMethod();
                    }}
                  />
                  {option.name} - {getFormattedPrice(option.amount!)}
                </label>
              </li>
            ))}
          </ul>
          <button type="submit" disabled={!selectedOption || isSubmitting}>
            {t("shipping-options.confirm_button")}
          </button>
        </form>
      )}
    </div>
  );
}
