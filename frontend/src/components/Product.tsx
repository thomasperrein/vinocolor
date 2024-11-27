import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart, useCreateLineItem, useProduct } from "medusa-react";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "./Product.css";
import "react-toastify/dist/ReactToastify.css";
import { useCartHomeMade } from "../CartContext";

export default function Product() {
  const { id } = useParams();
  const { product, isLoading } = useProduct(id!);
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { createCart } = useCart();
  const { refetch, cartId } = useCartHomeMade();

  const createLineItem = useCreateLineItem(cartId);

  const handleCreateCartAndAddItem = (variantId: string, quantity: number) => {
    setIsAdding(true);
    createCart.mutate(
      {},
      {
        onSuccess: ({ cart }) => {
          localStorage.setItem("cart_id", cart.id);
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
            .then((res) => {
              console.log(res);
              // Once the cart is successfully created, add the item to the cart
              handleAddItem(variantId, quantity);
            });
        },
        onError: () => {
          setIsAdding(false);
        },
      }
    );
  };

  const handleAddItem = (variantId: string, quantity: number) => {
    setIsAdding(true);
    createLineItem.mutate(
      {
        variant_id: variantId,
        quantity,
      },
      {
        onSuccess: ({ cart }) => {
          console.log("Cart items:", cart.items);
          setIsAdding(false);
          refetch();
          toast.success(t("product.item_added_success"));
        },
        onError: () => {
          setIsAdding(false);
        },
      }
    );
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="separator-product"></div>
      <div className="product-section-page">
        {isLoading && <span>{t("product.loading")}</span>}
        {product && (
          <>
            <div className="product-section-page-img">
              <img
                alt={product.title}
                src={product.thumbnail ? product.thumbnail : ""}
                onClick={() => openModal(product.thumbnail || "")}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="product-section-page-content">
              <h1>{product.title}</h1>
              <p> Packaging : {product.weight}g</p>
              <p>{product.description}</p>
              <p>
                {getFormattedPrice(product.variants?.[0]?.prices?.[0]?.amount)}
              </p>
              <button
                onClick={() => {
                  if (product.variants[0].id) {
                    if (cartId === "error") {
                      handleCreateCartAndAddItem(product.variants[0].id, 1);
                    } else {
                      handleAddItem(product.variants[0].id, 1);
                    }
                  }
                }}
                disabled={isAdding}
              >
                {isAdding
                  ? t("product.adding_to_cart")
                  : t("product.add_to_cart")}
              </button>
            </div>
          </>
        )}
        <ToastContainer />
      </div>

      {/* Modale */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <img
              src={modalImage}
              alt="Modal"
              className="modal-image"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
