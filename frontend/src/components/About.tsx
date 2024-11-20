import aboutImg from "../assets/img/about-img.png";
import about1svg from "../assets/img/about-img1.svg";
import about2svg from "../assets/img/about-img2.svg";
import AboutItem from "./AboutItem";
import HeroSection from "./HeroSection";
import { ImagePositionEnum } from "./AboutItem";
import "./About.css";

export default function About() {
  return (
    <main>
      <HeroSection
        title="Vinocolor, a story of colour, tradition and excellence ! "
        subtitle="Immerse yourself in the history of Vinocolor, a brand born of a passion for wine and the art of colour, where each pigment tells the story of a new adventure."
        srcImage={aboutImg}
      />
      <section className="about-section">
        <AboutItem
          title="The Art of Sublimating Barrels"
          subtitle="NATURAL ORIGIN"
          description="Vinocolor embodies natural innovation, born of a passion for wine and respect for traditional know-how. This unique powder, made from 80% freeze-dried red wine and 20% grape extract, is designed to enhance the appearance of barrels by masking wine spills."
          srcImage={about1svg}
          imagePosition={ImagePositionEnum.Right}
        />
        <AboutItem
          title="The brand with the distinction in Red"
          subtitle="PRESERVED ELEGANCE"
          description="Vinocolor is applied to the central area of the barrels, known as the jable, to preserve their appearance during the various stages of vinification, particularly during topping-up. With Vinocolor, each barrel retains its neat, elegant appearance, in perfect harmony with the art of winemaking."
          srcImage={about2svg}
          imagePosition={ImagePositionEnum.Left}
        />
      </section>
    </main>
  );
}
