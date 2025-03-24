
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  className
}) => {
  return (
    <div 
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {subtitle && (
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full uppercase animate-fade-in">
          {subtitle}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
