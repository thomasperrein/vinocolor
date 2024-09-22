import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { t, i18n } = useTranslation("fr", { useSuspense: false });

  const handleLangChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">{t("landing.name")}</Link>
        </li>
        <li>
          <Link to="/products">{t("products.name")}</Link>
        </li>
        <li className="pl-10 inline-flex">
          <select
            className="p-2"
            onChange={handleLangChange}
            defaultValue={"fr"}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </li>
      </ul>
    </nav>
  );
}
