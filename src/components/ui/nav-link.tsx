
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  children, 
  className,
  activeClassName,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg transition-colors duration-200 relative group',
        isActive 
          ? cn('text-primary font-medium', activeClassName) 
          : 'text-foreground hover:text-primary hover:bg-muted/50',
        className
      )}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );
};

export default NavLink;
