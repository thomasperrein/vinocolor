import { useTranslation } from "react-i18next";
import map from "../assets/img/carte.svg";
import circle from "../assets/img/circle.svg";
import "./Map.css";

export default function Map() {
  const { t } = useTranslation();

  return (
    <div className="map">
      <img src={map} alt={t("map.legend")} />
      <div className="legend">
        <img src={circle} alt="Legend circle" />
        <p>{t("map.legend")}</p>
      </div>
    </div>
  );
}
