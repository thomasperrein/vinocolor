import { useTranslation } from "react-i18next";
import WhyVinoItem from "./WhyVinoItem";
import glassOfWine from "../assets/img/glass-of-wine.svg";
import palette from "../assets/img/palette.svg";
import grappe from "../assets/img/grappe.svg";
import "./WhyVino.css";

export default function WhyVino() {
  const { t } = useTranslation();

  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">{t("why-vino.title")}</h1>
      <div className="why-vino">
        <WhyVinoItem imgSrc={palette} description={t("why-vino.items.1")} />
        <WhyVinoItem imgSrc={glassOfWine} description={t("why-vino.items.2")} />
        <WhyVinoItem imgSrc={grappe} description={t("why-vino.items.3")} />
      </div>
    </div>
  );
}
