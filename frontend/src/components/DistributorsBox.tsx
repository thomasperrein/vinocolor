import { useTranslation } from "react-i18next";
import "./DistributorBox.css";

export default function DistributorBox() {
  const { t } = useTranslation();

  return (
    <div className="distributor-box">
      <p>{t("distributor-box.description")}</p>
      <ul>
        <li>{t("distributor-box.countries.france")}</li>
        <li>{t("distributor-box.countries.spain")}</li>
        <li>{t("distributor-box.countries.italy")}</li>
        <li>{t("distributor-box.countries.germany")}</li>
        <li>{t("distributor-box.countries.hungary")}</li>
        <li>{t("distributor-box.countries.greece")}</li>
        <li>{t("distributor-box.countries.canada")}</li>
        <li>{t("distributor-box.countries.united_states")}</li>
      </ul>
    </div>
  );
}
