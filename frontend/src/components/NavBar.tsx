import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation("en", { useSuspense: false });

  const handleLangChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="border border-b border-gray-200">
      <div className="container flex justify-between my-4">
        <span>{t("landing.description")}</span>

        <div>
          <div className="pl-10 inline-flex">
            <select className="p-2" onChange={handleLangChange}>
              <option value="fr" selected>
                FR
              </option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
