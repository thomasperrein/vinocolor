import { useTranslation } from "react-i18next";
import DistributorBox from "./DistributorsBox";
import "./InternationalDistributor.css";
import Map from "./Map";

export default function InternationalDistributor() {
  const { t } = useTranslation();

  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">{t("international-distributor.title")}</h1>
      <div className="international-distributor">
        <DistributorBox />
        <Map />
      </div>
    </div>
  );
}
