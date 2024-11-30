import { useTranslation } from "react-i18next";
import vino from "../assets/img/vino.svg";
import vinoPowder from "../assets/img/vino-powder.svg";
import vinoPainting from "../assets/img/vino-painting.svg";
import "./UserGuide.css";
import UserGuideItem from "./UserGuideItem";

export default function UserGuide() {
  const { t } = useTranslation();

  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">{t("user-guide.title")}</h1>
      <div className="steps">
        <UserGuideItem
          step={1}
          imgSrc={vino}
          description={t("user-guide.steps.1")}
        />
        <UserGuideItem
          step={2}
          imgSrc={vinoPowder}
          description={t("user-guide.steps.2")}
        />
        <UserGuideItem
          step={3}
          imgSrc={vinoPainting}
          description={t("user-guide.steps.3")}
        />
      </div>
    </div>
  );
}
