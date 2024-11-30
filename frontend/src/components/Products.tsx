import { useTranslation } from "react-i18next";
import { useProducts } from "medusa-react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import barrel from "../assets/img/barrel.jpeg";
import ProductItem from "./ProductItem";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import "./Products.css";

export default function Products() {
  const { t } = useTranslation();
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  const handleProductClick = (productId?: string) => {
    if (!productId) return;
    navigate(`/products/${productId}`);
  };

  return (
    <main>
      <HeroSection
        title={t("products.hero_title")}
        subtitle={t("products.hero_subtitle")}
        srcImage={barrel}
      />
      <section className="product-section">
        <h1>{t("products.section_title")}</h1>
        {isLoading ? (
          <p>{t("products.loading")}</p>
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
