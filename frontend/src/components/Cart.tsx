import { useGetCart } from "medusa-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const Cart = () => {
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart, isLoading, error } = useGetCart(cartId);
  const { t } = useTranslation();
  const [itemsCount, setItemsCount] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      setItemsCount(cart.items.length);
    }
  }, [cart]);

  if (cartId === "error") {
    return <div>{t("cart.error")}</div>;
  }

  if (isLoading) {
    return <div>{t("cart.loading")}</div>;
  }

  if (error) {
    return <div>{t("cart.fetch_error")}</div>;
  }

  return (
    <div>
      {t("cart.items_in_cart")} {itemsCount}
    </div>
  );
};

export default Cart;
