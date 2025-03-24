
import React from 'react';

interface StockBadgeProps {
  level: "high" | "medium" | "low" | "out";
  className?: string;
}

const StockBadge: React.FC<StockBadgeProps> = ({ level, className = '' }) => {
  const badges = {
    high: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-100',
      label: 'In Stock'
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-800 dark:text-blue-100',
      label: 'In Stock'
    },
    low: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-100',
      label: 'Low Stock'
    },
    out: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-100',
      label: 'Out of Stock'
    }
  };
  
  const { bg, text, label } = badges[level];
  
  return (
    <span className={`${bg} ${text} text-xs px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
};

export default StockBadge;
