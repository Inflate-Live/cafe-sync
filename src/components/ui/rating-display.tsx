
import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating?: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating = 0,
  size = 'md',
  showEmpty = true,
  className = ''
}) => {
  const starSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };
  
  const starSize = starSizes[size];
  
  if (rating === 0 && !showEmpty) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={starSize}
          className={`${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : star <= rating + 0.5
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
      {rating > 0 && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
