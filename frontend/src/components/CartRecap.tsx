import { useEffect, useState } from "react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import "./CartRecap.css";
import { useCartHomeMade } from "../CartContext";
import { useTranslation } from "react-i18next";

export default function CartRecap() {
  const { cart, cartIdState, isLoading, error, reloadTrigger } =
    useCartHomeMade();
  const [totalPrice, setTotalPrice] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (cart?.items) {
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      const shippingTotal = cart?.shipping_total || 0;
      setTotalPrice(cartTotal + shippingTotal);
    }
  }, [cart?.items, cart?.shipping_total, reloadTrigger]);

  if (cartIdState === "error") {
    return <div>{t("cart-recap.error")}</div>;
  }

  if (isLoading) {
    return <div>{t("cart-recap.loading")}</div>;
  }

  if (error) {
    return <div>{t("cart-recap.global-error")}</div>;
  }

  return (
    <div className="cart-recap">
      <h2>{t("cart-recap.title")}</h2>
      {cart && cart.items && cart.items.length > 0 ? (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <p>
                  {t("cart-recap.product-title")} {item.title}
                </p>
                <p>
                  {t("cart-recap.product-quantity")} {item.quantity}
                </p>
                <p>
                  {t("cart-recap.total-price")}{" "}
                  {(item.unit_price / 100).toFixed(2)}{" "}
                  {cart.region.currency_code.toUpperCase()}
                </p>
              </li>
            ))}
          </ul>
          <div className="total">
            <p>
              <strong>{t("cart-recap.shipping")}</strong>{" "}
              {getFormattedPrice(cart.shipping_total!)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
            <p>
              <strong>{t("cart-recap.total")}</strong>{" "}
              {getFormattedPrice(totalPrice)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        <div>{t("cart-recap.empty")}</div>
      )}
    </div>
  );
}
