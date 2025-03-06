import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Layout from "./components/layout/Layout";
import Router from "./Router.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Layout>
            <Router />
          </Layout>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
