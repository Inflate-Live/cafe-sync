
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, Check, Star, ArrowUpDown } from 'lucide-react';

interface MenuFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "default" | "price" | "rating";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: "default" | "price" | "rating", order: "asc" | "desc") => void;
  showOnlyAvailable: boolean;
  onAvailabilityChange: (value: boolean) => void;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  showOnlyAvailable,
  onAvailabilityChange
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Menu</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortChange(
              sortBy === "default" ? "price" : 
              sortBy === "price" ? "rating" : "default",
              sortOrder
            )}
            className="group"
          >
            {sortBy === "default" && <SlidersHorizontal className="w-4 h-4 mr-2" />}
            {sortBy === "price" && <ArrowUpDown className="w-4 h-4 mr-2" />}
            {sortBy === "rating" && <Star className="w-4 h-4 mr-2" />}
            
            {sortBy === "default" && "Default"}
            {sortBy === "price" && "Price"}
            {sortBy === "rating" && "Rating"}
          </Button>
          
          {sortBy !== "default" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")}
              className="p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform ${
                  sortOrder === "desc" ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6-6 6 6" />
                <path d="m6 15 6 6 6-6" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("all")}
          className="rounded-full"
        >
          All
        </Button>
        
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          id="available-only"
          checked={showOnlyAvailable}
          onCheckedChange={onAvailabilityChange}
        />
        <Label htmlFor="available-only">Show only available items</Label>
      </div>
    </div>
  );
};

export default MenuFilters;
