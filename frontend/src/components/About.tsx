import aboutImg from "../assets/img/about-img.png";
import HeroSection from "./HeroSection";

export default function About() {
  return (
    <main>
      <HeroSection
        title="Vinocolor, a story of colour, tradition and excellence ! "
        subtitle="Immerse yourself in the history of Vinocolor, a brand born of a passion for wine and the art of colour, where each pigment tells the story of a new adventure."
        srcImage={aboutImg}
      />
      <section className="product-section"></section>
    </main>
  );
}
