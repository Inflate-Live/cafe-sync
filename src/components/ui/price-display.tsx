
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  discountedPrice?: number;
  discount?: {
    percentage: number;
    isPublic: boolean;
  };
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discountedPrice,
  discount,
  className = ''
}) => {
  const hasDiscount = discountedPrice !== undefined && discount?.isPublic;
  
  if (!hasDiscount) {
    return <span className={className}>{formatCurrency(price)}</span>;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-primary font-medium">
        {formatCurrency(discountedPrice!)}
      </span>
      <span className="text-muted-foreground text-sm line-through">
        {formatCurrency(price)}
      </span>
      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-2 py-0.5 rounded-full">
        {discount!.percentage}% off
      </span>
    </div>
  );
};

export default PriceDisplay;
