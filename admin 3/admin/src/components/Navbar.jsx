import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminApi from "../services/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminApi.auth.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUser();
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/products", label: "Products" },
    { path: "/orders", label: "Orders" },
    { path: "/logout", label: "Logout", isLogout: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-[0_4px_12px_rgba(34,197,94,0.3)] border-b border-green-600 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              src="/images/white4.png.png"
                alt="logo" 
                className="w-10 md:w-16 h-auto rounded-full border- border-green-500"
              />
              <span className="text-xl font-extrabold text-green-400">
                Vin2Grow Admin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isLogout ? (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  className="text-green-400 hover:text-green-300 font-medium text-sm transition-all duration-200 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "text-green-400 border-b-2 border-green-400 font-bold"
                      : "text-gray-300 hover:text-green-400 hover:font-bold"
                  } px-3 py-2 text-sm font-medium transition-all duration-200`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-green-600">
          {navItems.map((item) =>
            item.isLogout ? (
              <button
                key={item.label}
                onClick={() => {
                  handleLogout();
                  handleNavClick();
                }}
                className="block w-full text-left text-green-400 hover:text-green-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {item.label}
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`${
                  location.pathname === item.path
                    ? "bg-gray-700 text-green-400 font-bold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-green-400"
                } block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
