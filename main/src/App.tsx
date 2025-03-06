import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Router from "./Router.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import FavoritesProvider from "./context/FavoritesProvider.tsx";

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
