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
          the art of colouring wine,
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
    </main>
  );
}
