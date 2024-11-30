import aboutImg from "../assets/img/about-img.png";
import about1svg from "../assets/img/about-img1.svg";
import about2svg from "../assets/img/about-img2.svg";
import AboutItem from "./AboutItem";
import HeroSection from "./HeroSection";
import { ImagePositionEnum } from "./AboutItem";
import "./About.css";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("fr", { useSuspense: false });
  return (
    <main>
      <HeroSection
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        srcImage={aboutImg}
      />
      <section className="about-section">
        <AboutItem
          title={t("about.section1.title")}
          subtitle={t("about.section1.subtitle")}
          description={t("about.section1.description")}
          srcImage={about1svg}
          imagePosition={ImagePositionEnum.Right}
        />
        <AboutItem
          title={t("about.section2.title")}
          subtitle={t("about.section2.subtitle")}
          description={t("about.section2.description")}
          srcImage={about2svg}
          imagePosition={ImagePositionEnum.Left}
        />
      </section>
    </main>
  );
}
