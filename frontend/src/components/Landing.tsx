import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useProducts } from "medusa-react";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useTranslation } from "react-i18next";
import { getFormattedPrice } from "../utils/getFormattedPrice";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import Socials from "./Socials";
import UserGuide from "./UserGuide";
import WhyVino from "./WhyVino";
import InternationalDistributor from "./InternationalDistributor";
import OurClients from "./OurClients";

export default function Landing() {
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProductClick = (productId?: string) => {
    navigate(`/${productId}`);
  };

  return isLoading ? (
    <div>{t("landing.loading")}</div>
  ) : (
    <>
      <main>
        <HeroSection />
        <Socials />
        <UserGuide />
        <WhyVino />
        <InternationalDistributor />
        <OurClients />
        {/* <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products?.map((product: PricedProduct) => {
            if (product.variants.length > 0 && product.variants[0].prices) {
              console.log(product);
              return (
                <Col
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div>{product.title}</div>
                  <div>
                    {getFormattedPrice(product.variants[0].prices[0].amount)}
                  </div>
                  <div>{product.thumbnail}</div>
                </Col>
              );
            } else {
              return <></>;
            }
          })}
        </Row> */}
      </main>
    </>
  );
}
