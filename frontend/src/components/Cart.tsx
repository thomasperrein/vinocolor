import { useGetCart, useUpdateLineItem, useDeleteLineItem } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart, isLoading, error, refetch } = useGetCart(cartId);
  const { mutate: updateItem } = useUpdateLineItem(cartId);
  const { mutate: deleteItem } = useDeleteLineItem(cartId);
  const { t } = useTranslation();

  const [totalPrice, setTotalPrice] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (cart?.items) {
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      setTotalPrice(cartTotal);
    }
  }, [cart?.items]);

  const handleUpdateQuantity = (lineItemId: string, quantity: number) => {
    setIsRefetching(true);
    updateItem(
      { lineId: lineItemId, quantity },
      {
        onSuccess: () => refetch().finally(() => setIsRefetching(false)),
      }
    );
  };

  const handleDeleteItem = (lineItemId: string) => {
    setIsRefetching(true);
    deleteItem(
      { lineId: lineItemId },
      {
        onSuccess: () => refetch().finally(() => setIsRefetching(false)),
        onError: () => localStorage.removeItem("cart_id"),
      }
    );
  };

  if (cartId === "error") {
    return <div className="cart-error">{t("cart.error")}</div>;
  }

  if (isLoading || isRefetching) {
    return <div className="cart-loading">{t("cart.loading")}</div>;
  }

  if (error) {
    return <div className="cart-error">{t("cart.fetch_error")}</div>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">{t("cart.title")}</h1>
      {cart?.items?.length ? (
        <div>
          <ul className="cart-item-list">
            {cart.items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">
                    {t("cart.price")}: {(item.unit_price / 100).toFixed(2)}{" "}
                    {cart.region.currency_code.toUpperCase()}
                  </p>
                  <div className="cart-item-actions">
                    <button
                      className="cart-button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="cart-item-quantity">{item.quantity}</span>
                    <button
                      className="cart-button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="cart-button cart-remove"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <p>
              {t("cart.total")}: {(totalPrice / 100).toFixed(2)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
          </div>
          <button className="cart-checkout">
            <a href="/checkout">{t("cart.checkout")}</a>
          </button>
        </div>
      ) : (
        <p>{t("cart.empty")}</p>
      )}
    </div>
  );
};

export default Cart;
