import { QueryClient } from "@tanstack/react-query";
import { MedusaProvider } from "medusa-react";
import Products from "./Products";
import Navbar from "./components/NavBar";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    fallbackLng: "fr",
    backend: {
      loadPath: "/translations/{{lng}}/translations.json",
    },
  });

const queryClient = new QueryClient();

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <Navbar />
      <Products />
    </MedusaProvider>
  );
};

export default App;
