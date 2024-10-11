import { useGetCart, useUpdateLineItem, useDeleteLineItem } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const Cart = () => {
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart, isLoading, error, refetch } = useGetCart(cartId);
  const { mutate: updateItem } = useUpdateLineItem(cartId);
  const { mutate: deleteItem } = useDeleteLineItem(cartId);
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false); // État pour gérer le loader

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
    setIsRefetching(true); // Affiche le loader
    updateItem(
      { lineId: lineItemId, quantity },
      {
        onSuccess: () => {
          refetch().finally(() => setIsRefetching(false)); // Cache le loader après refetch
        },
      }
    );
  };

  const handleDeleteItem = (lineItemId: string) => {
    setIsRefetching(true); // Affiche le loader
    deleteItem(
      { lineId: lineItemId },
      {
        onSuccess: () => {
          refetch().finally(() => setIsRefetching(false)); // Cache le loader après refetch
        },
      }
    );
  };

  if (cartId === "error") {
    return <div>{t("cart.error")}</div>;
  }

  if (isLoading || isRefetching) {
    return <div>{t("cart.loading")}</div>; // Affiche le loader pendant le refetch
  }

  if (error) {
    return <div>{t("cart.fetch_error")}</div>;
  }

  return (
    <div>
      <h1>Votre panier</h1>
      {cart && cart.items && (
        <div>
          <ul>
            {cart.items.map((item) => (
              <li key={item.id}>
                <div>
                  <p>{item.title}</p>
                  <p>
                    Prix: {(item.unit_price / 100).toFixed(2)}{" "}
                    {cart.region.currency_code.toUpperCase()}
                  </p>
                  <div>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p>
              {t("cart.total")}: {(totalPrice / 100).toFixed(2)}{" "}
              {cart.region.currency_code.toUpperCase()}
            </p>
          </div>
          <button>
            <a href="/checkout">{t("cart.checkout")}</a>
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
