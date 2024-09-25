import Landing from "../components/Landing";
import PrivacyPolicy from "../components/PrivacyPolicy";
import Product from "../components/Product";

export const listPathElement = [
  { path: "/", element: <Landing /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/:id", element: <Product /> },
];
