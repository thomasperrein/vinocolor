import { useProducts } from "medusa-react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import barrel from "../assets/img/barrel.jpeg";
import ProductItem from "./ProductItem";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import "./Products.css";

export default function Products() {
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();
  const handleProductClick = (productId?: string) => {
    if (!productId) return;
    navigate(`/products/${productId}`);
  };
  return (
    <main>
      <HeroSection
        title="The art of colour in the service of wine !"
        subtitle="Discover our natural powder, created to give life and prestige to 
each barrel, while respecting the artisanal character of the wine. "
        srcImage={barrel}
      />
      <section className="product-section">
        <h1>Our products</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="products">
            {products?.map((product: PricedProduct) => {
              if (product.variants.length > 0 && product.variants[0].prices) {
                return (
                  <ProductItem
                    key={product.id}
                    product={product}
                    handleProductClick={handleProductClick}
                  />
                );
              } else {
                return <></>;
              }
            })}
          </div>
        )}
      </section>
    </main>
  );
}
