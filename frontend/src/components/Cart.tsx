import { useUpdateLineItem, useDeleteLineItem } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./Cart.css";
import { useCartHomeMade } from "../CartContext";

const Cart = () => {
  const { cartIdState, cart, error, refetch } = useCartHomeMade();
  const { mutate: updateItem } = useUpdateLineItem(cartIdState);
  const { mutate: deleteItem } = useDeleteLineItem(cartIdState);
  const { t } = useTranslation();

  const [totalPrice, setTotalPrice] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (cart?.items) {
      const cartTotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      setTotalPrice(cartTotal);

      const initialQuantities = cart.items.reduce(
        (acc, item) => ({ ...acc, [item.id]: item.quantity }),
        {}
      );
      setQuantities(initialQuantities);
    }
  }, [cart?.items]);

  const handleUpdateQuantity = (lineItemId: string, quantity: number) => {
    setLoadingItems((prev) => ({ ...prev, [lineItemId]: true }));
    updateItem(
      { lineId: lineItemId, quantity },
      {
        onSuccess: () => {
          refetch().finally(() => {
            setLoadingItems((prev) => ({ ...prev, [lineItemId]: false }));
          });
        },
      }
    );
  };

  const handleQuantityChange = (lineItemId: string, value: string) => {
    if (value === "") {
      setQuantities((prev) => ({
        ...prev,
        [lineItemId]: 0,
      }));
      return;
    }

    if (/^\d+$/.test(value)) {
      const numericValue = parseInt(value, 10);
      setQuantities((prev) => ({
        ...prev,
        [lineItemId]: numericValue,
      }));
    }
  };

  const handleQuantityBlur = (lineItemId: string) => {
    const newQuantity = quantities[lineItemId];
    const currentItem = cart?.items?.find((item) => item.id === lineItemId);
    if (currentItem && newQuantity !== currentItem.quantity) {
      handleUpdateQuantity(lineItemId, newQuantity);
    }
  };

  const handleDeleteItem = (lineItemId: string) => {
    setIsRefetching(true);
    deleteItem(
      { lineId: lineItemId },
      {
        onSuccess: () => {
          refetch().finally(() => setIsRefetching(false));
        },
        onError: () => {
          setIsRefetching(false);
          localStorage.removeItem("cart_id");
        },
      }
    );
  };

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
                      disabled={
                        item.quantity === 1 ||
                        item.quantity === 0 ||
                        loadingItems[item.id]
                      }
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className={`cart-item-quantity-input ${
                        loadingItems[item.id] ? "loading" : ""
                      }`}
                      value={quantities[item.id]}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      onBlur={() => handleQuantityBlur(item.id)}
                      disabled={loadingItems[item.id]}
                    />
                    {loadingItems[item.id] && (
                      <span className="quantity-loading-spinner"></span>
                    )}
                    <button
                      className="cart-button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={loadingItems[item.id]}
                    >
                      +
                    </button>
                    <button
                      className="cart-button cart-remove"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={loadingItems[item.id]}
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
          <button
            className="cart-checkout"
            disabled={
              isRefetching || Object.values(loadingItems).some((v) => v)
            }
          >
            <a href="/checkout">{t("cart.checkout")}</a>
          </button>
        </div>
      ) : (
        <>
          {error && <p className="cart-error">{t("cart.error")}</p>}
          {cartIdState !== "error" && !error && (
            <p className="cart-empty">{t("cart.empty")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
