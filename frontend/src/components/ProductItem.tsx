import { useTranslation } from "react-i18next";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import notFound from "../assets/img/image-not-found-icon.svg";
import "./ProductItem.css";

interface ProductItemProps {
  product: PricedProduct;
  handleProductClick: (id?: string) => void;
}

export default function ProductItem({
  product,
  handleProductClick,
}: ProductItemProps) {
  const { t } = useTranslation();

  return (
    <div
      key={product.id}
      onClick={() => handleProductClick(product.id)}
      className="product-item"
    >
      {product.thumbnail ? (
        <img
          src={product.thumbnail}
          alt={t("product-item.alt_product_image")}
        />
      ) : (
        <img src={notFound} alt={t("product-item.alt_image_not_found")} />
      )}

      <h2>{product.title}</h2>
      <div className="details">{product.description}</div>
      <button>{t("product-item.select_button")}</button>
    </div>
  );
}
