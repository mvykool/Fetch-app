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
      navigate("/login");
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary fixed w-full z-50 border-black border-b-[1px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="size-8" />
                <span className="text-2xl font-bold text-white text-border">
                  {strings.header.logo}
                </span>
              </a>
            </div>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <div className="flex items-center space-x-1 text-white cursor-pointer">
                  <i className="bx bxs-heart text-rose-400 text-2xl text-border"></i>
                  <span className=" text-Coltext text-base rounded-full px-2 py-0.5 font-bold">
                    {favorites.length}
                  </span>
                </div>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex cursor-pointer items-center space-x-2 text-white hover:text-Coltext focus:outline-none transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center border-black border-[1px] justify-center text-blue-700 font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium tracking-wide text-border">
                      {user?.name}
                    </span>
                    <i className="bx bx-chevron-down text-2xl text-border"></i>
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
                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {strings.header.signOut}
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
                  <i className="bx bx-x text-3xl"></i>
                ) : (
                  <i className="bx bx-menu text-3xl"></i>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMenuOpen && (
          <div className="md:hidden pt-2 pb-4 border-t border-black">
            <div className="space-y-1">
              {/* User Info */}
              <div className="px-4 py-3 bg-secondary rounded-md flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 border-black border flex items-center justify-center text-blue-700 font-semibold text-xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-border tracking-wide">
                    {user?.name}
                  </p>
                  <p className="text-Coltext text-sm truncate">{user?.email}</p>
                </div>
              </div>

              {/* Favorites */}
              <div className="px-4 py-3 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <i className="bx bxs-heart text-rose-400 text-2xl text-border"></i>
                  <span>{strings.header.favorites}</span>
                </div>
                <div className=" text-Coltext text-base rounded-full px-2 py-0.5 font-bold">
                  {favorites.length}
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-3 text-white  rounded-md"
              >
                <i className="bx bx-log-out text-2xl"></i>
                <span>{strings.header.signOut}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
