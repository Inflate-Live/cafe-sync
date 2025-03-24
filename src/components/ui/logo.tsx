
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  vertical?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', vertical = false }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl sm:text-3xl',
  };

  return (
    <Link 
      to="/" 
      className={`font-bold flex ${vertical ? 'flex-col items-center' : 'items-center gap-2'} text-foreground hover:opacity-90 transition-opacity duration-200`}
    >
      <Coffee className={`text-primary ${size === 'small' ? 'w-5 h-5' : size === 'medium' ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'}`} />
      <div>
        <span className={`${sizeClasses[size]}`}>
          <span className="text-primary">Café</span>
          <span>Sync</span>
        </span>
        <span className="text-xs block text-muted-foreground">by Inflate</span>
      </div>
    </Link>
  );
};

export default Logo;
