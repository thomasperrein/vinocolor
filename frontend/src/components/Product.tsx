import { useParams } from "react-router-dom";
import { useCart, useCreateLineItem, useProduct } from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import { useTranslation } from "react-i18next";
import "./Product.css";

export default function Product() {
  const { id } = useParams();
  const { product, isLoading } = useProduct(id!);
  const { t } = useTranslation();

  const cartId = localStorage.getItem("cart_id") || "error";

  const { createCart } = useCart();

  const handleCreateCart = () => {
    createCart.mutate(
      {},
      {
        onSuccess: ({ cart }) => {
          console.log("creation cart");
          localStorage.setItem("cart_id", cart.id);
          console.log("affectation cust");
          fetch(`http://localhost:9000/store/carts/${cart.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              "x-publishable-api-key": import.meta.env
                .VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY,
            },
            body: JSON.stringify({
              customer_id: "cus_01JCK1EDMWFK1S3H0B0FNMR0PV",
            }),
          })
            .then((res) => res.json())
            .then((res) => console.log(res));
          console.log("no error");
        },
      }
    );
  };

  const createLineItem = useCreateLineItem(cartId);

  const handleAddItem = (variantId: string, quantity: number) => {
    createLineItem.mutate(
      {
        variant_id: variantId,
        quantity,
      },
      {
        onSuccess: ({ cart }) => {
          console.log("la", cart.items);
        },
      }
    );
  };

  return (
    <>
      <div className="separator-product"></div>
      <div className="product-section">
        {isLoading && <span>{t("product.loading")}</span>}
        {product && (
          <>
            <div className="product-section-img">
              <img
                alt={product.title}
                src={product.thumbnail ? product.thumbnail : ""}
              />
            </div>
            <div className="product-section-content">
              <h1>{product.title}</h1>
              <p>
                Composition : 80% red wine, 20% grape extract Packaging : 100 g
                Use : dilute 100 g of product in 1 litre of water to colour
                around 30 to 50 barrels. Store in a cool, dry place.
              </p>
              <p>
                {getFormattedPrice(product.variants?.[0]?.prices?.[0]?.amount)}
              </p>
              <button
                onClick={() => {
                  if (product.variants[0].id) {
                    console.log("cart", cartId);
                    if (cartId == "error") {
                      handleCreateCart();
                      handleAddItem(product.variants[0].id, 1);
                    } else {
                      handleAddItem(product.variants[0].id, 1);
                    }
                  }
                }}
              >
                {t("product.add_to_cart")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
