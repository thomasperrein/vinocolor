import { useTranslation } from "react-i18next";
import OurClient from "./OurClient";
import chateauLangoa from "../assets/logo/chateau-langoa.svg";
import chateauKirvan from "../assets/logo/chateau-kirvan.svg";
import chateauPuyducasse from "../assets/logo/chateau-puyducasse.svg";
import chateauJcp from "../assets/logo/chateau-jcp.svg";
import "./OurClients.css";

export default function OurClients() {
  const { t } = useTranslation();

  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">{t("our-clients.title")}</h1>
      <div className="clients">
        <div className="client-level level-1">
          <OurClient srcClientImage={chateauLangoa} />
        </div>
        <div className="client-level level-2">
          <OurClient srcClientImage={chateauKirvan} />
        </div>
        <div className="client-level level-1">
          <OurClient srcClientImage={chateauPuyducasse} />
        </div>
        <div className="client-level level-2">
          <OurClient srcClientImage={chateauJcp} />
        </div>
        <div className="client-level level-1">
          <OurClient srcClientImage={chateauPuyducasse} />
        </div>
      </div>
    </div>
  );
}
