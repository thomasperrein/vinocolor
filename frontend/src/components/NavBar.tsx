import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGetCart } from "medusa-react"; // Assurez-vous que ce hook est disponible pour récupérer le panier
import logo from "../assets/logo/logo.svg";
import cartLogo from "../assets/logo/cart.svg";
import "./Navbar.css";

export default function Navbar() {
  const { t, i18n } = useTranslation("fr", { useSuspense: false });
  const cartId = localStorage.getItem("cart_id") || "error";
  const { cart } = useGetCart(cartId);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartQuantity(totalQuantity);
    }
  }, [cart?.items]);

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
            <Link to="/">
              <b>{t("layout.home")}</b>
            </Link>
          </li>
          <li>
            <Link to="/products">
              <b>{t("layout.products")}</b>
            </Link>
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
            <Link to="/about">
              <b>{t("layout.about")}</b>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <b>{t("layout.contact")}</b>
            </Link>
          </li>
          <li style={{ marginRight: "0px", position: "relative" }}>
            <Link to="/my-cart">
              <img src={cartLogo} alt="cart" />
              {cartQuantity > 0 && (
                <span className="cart-badge">{cartQuantity}</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
