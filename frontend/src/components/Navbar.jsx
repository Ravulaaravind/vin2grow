import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaSearch, FaRegCreditCard } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("Location changed, closing menus. New location:", location.pathname);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-green-900 py-2 shadow-xl' 
          : 'bg-gradient-to-r from-gray-900 via-gray-800 to-green-900/90 backdrop-blur-sm py-2 px-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/images/Logos/logo1.png" 
                  alt="pickles Logo" 
                  className="h-14 w-auto transition-transform duration-300 hover:scale-105"
                />
               <span className="text-xl font-bold text-green-300 ml-3">Vin2Grow</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-green-400'
                      : 'text-gray-300 hover:text-green-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              {location.pathname === '/' && (
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hidden md:block p-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Link>

              {/* User Menu */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-gray-300 hover:text-green-400 hover:bg-gray-700 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FaUser className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl py-2 ring-1 ring-green-500 ring-opacity-20 z-50 border border-gray-700 hidden md:block"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700 mb-1">
                            <p className="font-semibold text-base text-green-400">{user.name}</p>
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Profile
                          </Link>

                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded flex items-center gap-2 transition-colors mt-1"
                          >
                            <FaSignOutAlt className="" />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-green-400 rounded transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="absolute top-0 left-0 right-0 bg-gray-900 p-4 border-b border-green-500"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 text-lg bg-gray-800 text-white border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <FaSearch className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[60px] z-40 md:hidden bg-gray-900 shadow-lg border-t border-green-500"
          >
            <div className="p-4">
              {/* Mobile Search */}
              <div className="mb-4 border-b border-gray-700 pb-4">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 text-sm bg-gray-800 text-white border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
                {navLinks
                  .filter(link => link.path === '/about' || link.path === '/contact')
                  .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-green-400'
                        : 'text-gray-300 hover:text-green-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Menu */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300">
                      <p className="font-medium text-green-400">{user.name}</p>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  null
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;