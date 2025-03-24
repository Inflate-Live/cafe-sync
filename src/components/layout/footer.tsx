
import React from 'react';
import Logo from '../ui/logo';
import { Sun, Moon } from 'lucide-react';

interface FooterProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <footer className="w-full py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo size="large" />
            <p className="mt-4 text-muted-foreground">
              A next-generation, real-time café and restaurant management system that enables 
              businesses to customize their platform, manage multiple branches, process orders, 
              track payments, and analyze performance in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="/order" className="text-muted-foreground hover:text-primary transition-colors">Order Now</a></li>
              <li><a href="/kitchen" className="text-muted-foreground hover:text-primary transition-colors">Kitchen</a></li>
              <li><a href="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Panel</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Settings</h3>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-primary/10 transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun size={18} />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CaféSync by Inflate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
