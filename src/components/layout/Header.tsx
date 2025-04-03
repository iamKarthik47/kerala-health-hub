
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Activity, Building, Map, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center size-9 rounded-lg bg-health-600 text-white">
                <Activity className="size-5" />
              </div>
              <div className="font-medium text-xl">Kerala Health</div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`gap-1.5 text-base ${isActive('/') ? 'bg-health-50 text-health-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <BarChart3 className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/hospitals">
              <Button 
                variant="ghost" 
                className={`gap-1.5 text-base ${isActive('/hospitals') ? 'bg-health-50 text-health-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Building className="size-4" />
                Hospitals
              </Button>
            </Link>
            <Link to="/districts">
              <Button 
                variant="ghost" 
                className={`gap-1.5 text-base ${isActive('/districts') ? 'bg-health-50 text-health-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Map className="size-4" />
                Districts
              </Button>
            </Link>
          </nav>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg"
        >
          <div className="px-6 py-4 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-1.5 text-base ${isActive('/') ? 'bg-health-50 text-health-900' : 'text-gray-600'}`}
              >
                <BarChart3 className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/hospitals" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-1.5 text-base ${isActive('/hospitals') ? 'bg-health-50 text-health-900' : 'text-gray-600'}`}
              >
                <Building className="size-4" />
                Hospitals
              </Button>
            </Link>
            <Link to="/districts" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-1.5 text-base ${isActive('/districts') ? 'bg-health-50 text-health-900' : 'text-gray-600'}`}
              >
                <Map className="size-4" />
                Districts
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
