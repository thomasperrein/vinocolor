import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../assets/logo/logo.svg";
import cart from "../assets/logo/cart.svg";
import "./Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation("fr", { useSuspense: false });

  const handleLangChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <header>
      <nav className="navbar">
        <ul className="nav-list nav-left">
          <li>
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </li>
          <li>
            <Link to="/">{t("layout.home")}</Link>
          </li>
          <li>
            <Link to="/products">{t("layout.products")}</Link>
          </li>
          <li>
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
        <ul className="nav-list nav-right">
          <li>
            <Link to="/about">{t("layout.about")}</Link>
          </li>
          <li>
            <Link to="/contact">{t("layout.contact")}</Link>
          </li>
          <li>
            <Link to="/my-cart">
              <img src={cart} alt="cart" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
