import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import Landing from "../components/Landing";
import PrivacyPolicy from "../components/PrivacyPolicy";
import Product from "../components/Product";
import Products from "../components/Products";

export const listPathElement = [
  { path: "/", element: <Landing /> },
  { path: "/products", element: <Products /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/:id", element: <Product /> },
  { path: "/my-cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
];
