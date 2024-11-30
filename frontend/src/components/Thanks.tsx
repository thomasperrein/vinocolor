import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import checkSvg from "../assets/logo/check.svg";
import thanksBanner from "../assets/img/thanks-banner.svg";
import "./Thanks.css";

export default function Thanks() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className="thanks">
      <h1>{t("thanks.title")}</h1>
      <img src={checkSvg} alt={t("thanks.alt_checkmark")} />
      <img src={thanksBanner} alt={t("thanks.alt_banner")} />
      <p>
        {t("thanks.message")} <b>{t("thanks.contact_email")}</b>.
      </p>
      <button onClick={handleBackHome}>{t("thanks.back_home_button")}</button>
    </div>
  );
}
