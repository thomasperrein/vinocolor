import Landing from "../components/Landing";
import Products from "../Products";
import PrivacyPolicy from "../components/PrivacyPolicy";

export const listPathElement = [
  { path: "/", element: <Landing /> },
  { path: "/products", element: <Products /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
];
