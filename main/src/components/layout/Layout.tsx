import React from "react";
import { useAuth } from "../../hooks/useAuth";
import Header from "./Header.tsx";
import { strings } from "../../constants/strings.ts";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-Coltext flex flex-col bg-light">
      {isAuthenticated && <Header />}
      <main className="flex-grow mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <footer className="bg-light border border-t-Coltext py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {strings.footer.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
