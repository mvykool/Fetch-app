import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { strings } from "../../constants/strings";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="size-8" />
                <h1 className="text-2xl font-bold text-white">
                  {strings.header.logo}
                </h1>
              </a>
            </div>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <div className="flex items-center space-x-1 text-white cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="bg-white text-blue-600 text-xs rounded-full px-2 py-0.5 font-bold">
                    {favorites.length}
                  </span>
                  <span>Favorites</span>
                </div>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-100 focus:outline-none transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-blue-700 font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{user?.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ml-1 transition-transform ${
                        isUserDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-blue-400">
            <div className="space-y-1">
              {/* User Info */}
              <div className="px-4 py-3 bg-blue-600 rounded-md flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 font-semibold text-xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-blue-200 text-sm truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Favorites */}
              <div className="px-4 py-3 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Favorites</span>
                </div>
                <div className="bg-white text-blue-600 text-xs rounded-full px-2 py-0.5 font-bold">
                  {favorites.length}
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 text-white hover:bg-blue-600 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
