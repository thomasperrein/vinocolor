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
  return (
    <div
      key={product.id}
      onClick={() => handleProductClick(product.id)}
      className="product-item"
    >
      {product.thumbnail ? (
        <img src={product.thumbnail} alt="product image" />
      ) : (
        <img src={notFound} alt="product image" />
      )}

      <h2>{product.title}</h2>
      <div className="details">{product.description}</div>
      <button>Select</button>
    </div>
  );
}
