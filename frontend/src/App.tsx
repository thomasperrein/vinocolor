import { QueryClient } from "@tanstack/react-query";
import { CartProvider, MedusaProvider } from "medusa-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import Layout from "./components/Layout";
import { listPathElement } from "./utils/listPathElement";

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
      publishableApiKey={
        import.meta.env.VITE_REACT_APP_MEDUSA_PUBLISHABLE_API_KEY
      }
    >
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {listPathElement.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              ;
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </MedusaProvider>
  );
};

export default App;
