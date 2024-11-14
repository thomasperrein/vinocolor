import HeroSection from "./HeroSection";
import Socials from "./Socials";
import UserGuide from "./UserGuide";
import WhyVino from "./WhyVino";
import InternationalDistributor from "./InternationalDistributor";
import OurClients from "./OurClients";
import img from "../assets/img/hero-img.jpg";

export default function Landing() {
  return (
    <main>
      <HeroSection
        suptitle="The natural touch for aging excellence"
        title="Vinocolor,
          <br />
          the art of colouring wine,
          <br />
          naturally"
        srcImage={img}
        buttonText="See our products"
        redirectLink="/products"
      />
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
  );
}
