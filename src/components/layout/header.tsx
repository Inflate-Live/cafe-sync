
import React, { useState, useEffect } from 'react';
import Logo from '../ui/logo';
import NavLink from '../ui/nav-link';
import { Menu, X, Coffee, Utensils, Settings, ExternalLink, Github, Home } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isElectron = window.navigator.userAgent.toLowerCase().indexOf('electron') > -1;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-background/80 backdrop-blur-md shadow-sm' : 'py-4 bg-background'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/"><Home className="mr-1" size={16} /> Dashboard</NavLink>
          <NavLink to="/order"><Coffee className="mr-1" size={16} /> Order</NavLink>
          <NavLink to="/kitchen"><Utensils className="mr-1" size={16} /> Kitchen</NavLink>
          <NavLink to="/admin"><Settings className="mr-1" size={16} /> Admin</NavLink>
          
          {!isElectron && (
            <>
              <NavLink to="/welcome"><Home className="mr-1" size={16} /> Welcome</NavLink>
              <a 
                href="https://github.com/Inflate-Live/cafe-verse-sync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg transition-colors duration-200 text-foreground hover:text-primary hover:bg-muted/50 flex items-center"
              >
                <Github className="mr-1" size={16} /> GitHub
              </a>
              <a 
                href="https://cafe-verse-sync.lovable.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg transition-colors duration-200 text-foreground hover:text-primary hover:bg-muted/50 flex items-center"
              >
                <ExternalLink className="mr-1" size={16} /> Demo
              </a>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-40 transition-all duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '60px' }}
      >
        <nav className="flex flex-col p-6 space-y-4">
          <NavLink to="/" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/order" onClick={closeMenu}>
            <div className="flex items-center">
              <Coffee className="mr-2" size={18} />
              <span>Order System</span>
            </div>
          </NavLink>
          <NavLink to="/kitchen" onClick={closeMenu}>
            <div className="flex items-center">
              <Utensils className="mr-2" size={18} />
              <span>Kitchen Display</span>
            </div>
          </NavLink>
          <NavLink to="/admin" onClick={closeMenu}>
            <div className="flex items-center">
              <Settings className="mr-2" size={18} />
              <span>Admin Panel</span>
            </div>
          </NavLink>
          
          {!isElectron && (
            <>
              <NavLink to="/welcome" onClick={closeMenu}>
                <div className="flex items-center">
                  <Home className="mr-2" size={18} />
                  <span>Welcome Page</span>
                </div>
              </NavLink>
              <a 
                href="https://github.com/Inflate-Live/cafe-verse-sync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-foreground hover:text-primary"
                onClick={closeMenu}
              >
                <Github className="mr-2" size={18} />
                <span>GitHub Repository</span>
              </a>
              <a 
                href="https://cafe-verse-sync.lovable.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-foreground hover:text-primary"
                onClick={closeMenu}
              >
                <ExternalLink className="mr-2" size={18} />
                <span>Live Demo</span>
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
