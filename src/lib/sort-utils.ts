
import { MenuItem } from "@/types";

export const sortByPrice = (items: MenuItem[], order: "asc" | "desc") => {
  return [...items].sort((a, b) => {
    const priceA = a.discountedPrice !== undefined ? a.discountedPrice : a.price;
    const priceB = b.discountedPrice !== undefined ? b.discountedPrice : b.price;
    
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
};

export const sortByRating = (items: MenuItem[], order: "asc" | "desc") => {
  return [...items].sort((a, b) => {
    const ratingA = a.averageRating || 0;
    const ratingB = b.averageRating || 0;
    
    return order === "asc" ? ratingA - ratingB : ratingB - ratingA;
  });
};

export const filterByCategory = (items: MenuItem[], category: string) => {
  if (!category || category === "all") return items;
  return items.filter(item => item.category === category);
};

export const filterByAvailability = (items: MenuItem[], showOnlyAvailable: boolean) => {
  if (!showOnlyAvailable) return items;
  return items.filter(item => item.available);
};
