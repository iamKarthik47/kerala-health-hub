
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, X, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 shadow-sm backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-health-500 to-health-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="ml-2.5 text-xl font-semibold text-gray-900">
              Kerala Health Central
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {['Dashboard', 'Hospitals', 'Diseases', 'Resources', 'Reports'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: a0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Link
                to={`/${item.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-health-600 hover:bg-gray-100 transition-all"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <div className="h-9 w-9 rounded-full bg-health-100 flex items-center justify-center">
            <span className="text-health-700 font-medium">AD</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md md:hidden hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg mt-4 rounded-lg overflow-hidden"
        >
          <div className="px-4 py-2 space-y-2">
            {['Dashboard', 'Hospitals', 'Diseases', 'Resources', 'Reports'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
