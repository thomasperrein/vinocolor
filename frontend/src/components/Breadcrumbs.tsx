import { useLocation, Link } from "react-router-dom";
import "./Breadcrumbs.css";
import { useTranslation } from "react-i18next";
import { breadcrumbMapping } from "../utils/breadcrumbMapping";

export default function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation("common", { useSuspense: false });

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;
      const translationKey = breadcrumbMapping[currentLink] || crumb;

      const translatedCrumb =
        t(translationKey) !== translationKey
          ? t(translationKey)
          : crumb.charAt(0).toUpperCase() + crumb.slice(1);

      return (
        <div className="crumb" key={currentLink}>
          <Link to={currentLink}>{translatedCrumb}</Link>
        </div>
      );
    });

  return (
    <div className="breadcrumbs">
      <div className="crumb">
        <Link to="/">{t(breadcrumbMapping["/"])}</Link>
      </div>
      {crumbs}
    </div>
  );
}
