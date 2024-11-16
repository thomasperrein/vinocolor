import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import Landing from "../components/Landing";
import PrivacyPolicy from "../components/PrivacyPolicy";
import Product from "../components/Product";
import Products from "../components/Products";
import About from "../components/About";

export const listPathElement = [
  { path: "/", element: <Landing /> },
  { path: "/about", element: <About /> },
  { path: "/products", element: <Products /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/products/:id", element: <Product /> },
  { path: "/my-cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
];
