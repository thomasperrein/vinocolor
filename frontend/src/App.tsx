import { QueryClient } from "@tanstack/react-query";
import { MedusaProvider } from "medusa-react";
import Products from "./Products";

const queryClient = new QueryClient();

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <Products />
    </MedusaProvider>
  );
};

export default App;
