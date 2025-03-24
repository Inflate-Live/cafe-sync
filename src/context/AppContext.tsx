import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppSettings, 
  Branch, 
  MenuItem, 
  Order, 
  Receipt, 
  AnalyticsData,
  PaymentMethod,
  Inventory,
  Ingredient,
  Rating
} from '@/types';
import { generateToken } from '@/lib/utils';
import { useJsPDF } from '@/hooks/use-jsPDF';

// Mock data for initial development
const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Downtown Branch",
    location: "123 Main Street",
    openingHours: "7AM",
    closingHours: "9PM",
    isActive: true,
  },
  {
    id: "2",
    name: "Riverside Location",
    location: "456 River View",
    openingHours: "8AM",
    closingHours: "10PM",
    isActive: true,
  },
  {
    id: "3",
    name: "Mall Kiosk",
    location: "789 Shopping Center",
    openingHours: "10AM",
    closingHours: "8PM",
    isActive: false,
  },
];

const mockIngredients: Ingredient[] = [
  { id: "1", name: "Coffee Beans", quantity: 5000, unit: "g", inStock: true },
  { id: "2", name: "Milk", quantity: 10000, unit: "ml", inStock: true },
  { id: "3", name: "Sugar", quantity: 3000, unit: "g", inStock: true },
  { id: "4", name: "Flour", quantity: 5000, unit: "g", inStock: true },
  { id: "5", name: "Butter", quantity: 2000, unit: "g", inStock: true },
  { id: "6", name: "Blueberries", quantity: 400, unit: "g", inStock: true },
  { id: "7", name: "Ice", quantity: 1000, unit: "g", inStock: true },
];

const mockInventory: Inventory[] = [
  {
    id: "1",
    menuItemId: "1",
    ingredients: [
      { id: "1", name: "Coffee Beans", quantity: 20, unit: "g", inStock: true },
      { id: "3", name: "Sugar", quantity: 10, unit: "g", inStock: true },
    ],
    stockLevel: "high",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    menuItemId: "2",
    ingredients: [
      { id: "1", name: "Coffee Beans", quantity: 20, unit: "g", inStock: true },
      { id: "2", name: "Milk", quantity: 150, unit: "ml", inStock: true },
      { id: "3", name: "Sugar", quantity: 10, unit: "g", inStock: true },
    ],
    stockLevel: "medium",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    menuItemId: "3",
    ingredients: [
      { id: "4", name: "Flour", quantity: 100, unit: "g", inStock: true },
      { id: "5", name: "Butter", quantity: 50, unit: "g", inStock: true },
    ],
    stockLevel: "high",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    menuItemId: "4",
    ingredients: [
      { id: "1", name: "Coffee Beans", quantity: 20, unit: "g", inStock: true },
      { id: "2", name: "Milk", quantity: 200, unit: "ml", inStock: true },
      { id: "3", name: "Sugar", quantity: 15, unit: "g", inStock: true },
    ],
    stockLevel: "low",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    menuItemId: "5",
    ingredients: [
      { id: "4", name: "Flour", quantity: 100, unit: "g", inStock: true },
      { id: "5", name: "Butter", quantity: 50, unit: "g", inStock: true },
      { id: "6", name: "Blueberries", quantity: 80, unit: "g", inStock: true },
    ],
    stockLevel: "medium",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    menuItemId: "6",
    ingredients: [
      { id: "1", name: "Coffee Beans", quantity: 25, unit: "g", inStock: true },
      { id: "7", name: "Ice", quantity: 150, unit: "g", inStock: true },
      { id: "3", name: "Sugar", quantity: 20, unit: "g", inStock: true },
    ],
    stockLevel: "high",
    lastUpdated: new Date().toISOString(),
  },
];

const mockRatings: Rating[] = [
  { id: "1", menuItemId: "1", orderId: "1", customerId: "1", rating: 4, createdAt: new Date().toISOString() },
  { id: "2", menuItemId: "2", orderId: "2", customerId: "2", rating: 5, createdAt: new Date().toISOString() },
  { id: "3", menuItemId: "3", orderId: "3", customerId: "3", rating: 3, createdAt: new Date().toISOString() },
  { id: "4", menuItemId: "4", orderId: "4", customerId: "4", rating: 4, createdAt: new Date().toISOString() },
  { id: "5", menuItemId: "5", orderId: "5", customerId: "5", rating: 5, createdAt: new Date().toISOString() },
  { id: "6", menuItemId: "6", orderId: "6", customerId: "6", rating: 4, createdAt: new Date().toISOString() },
];

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Strong, concentrated coffee served in small doses",
    price: 3.5,
    discountedPrice: 2.45,
    discount: {
      percentage: 30,
      code: "COFFEE30",
      isPublic: true,
    },
    imageUrl: "https://images.unsplash.com/photo-1510707577719-ae7544227e3c?q=80&w=1000&auto=format&fit=crop",
    category: "Coffee",
    available: true,
    branchId: "1",
    inventory: mockInventory.find(i => i.menuItemId === "1"),
    ratings: mockRatings.filter(r => r.menuItemId === "1"),
    averageRating: 4,
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1534778101802-52d2e4497066?q=80&w=1000&auto=format&fit=crop",
    category: "Coffee",
    available: true,
    branchId: "1",
    inventory: mockInventory.find(i => i.menuItemId === "2"),
    ratings: mockRatings.filter(r => r.menuItemId === "2"),
    averageRating: 5,
  },
  {
    id: "3",
    name: "Croissant",
    description: "Buttery, flaky pastry",
    price: 3.0,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    category: "Pastry",
    available: true,
    branchId: "1",
    inventory: mockInventory.find(i => i.menuItemId === "3"),
    ratings: mockRatings.filter(r => r.menuItemId === "3"),
    averageRating: 3,
  },
  {
    id: "4",
    name: "Latte",
    description: "Espresso with a lot of steamed milk and a little foam",
    price: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=1000&auto=format&fit=crop",
    category: "Coffee",
    available: true,
    branchId: "2",
    inventory: mockInventory.find(i => i.menuItemId === "4"),
    ratings: mockRatings.filter(r => r.menuItemId === "4"),
    averageRating: 4,
  },
  {
    id: "5",
    name: "Blueberry Muffin",
    description: "Sweet muffin filled with blueberries",
    price: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=1000&auto=format&fit=crop",
    category: "Pastry",
    available: true,
    branchId: "2",
    inventory: mockInventory.find(i => i.menuItemId === "5"),
    ratings: mockRatings.filter(r => r.menuItemId === "5"),
    averageRating: 5,
  },
  {
    id: "6",
    name: "Iced Coffee",
    description: "Chilled coffee served over ice",
    price: 3.75,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1000&auto=format&fit=crop",
    category: "Coffee",
    available: true,
    branchId: "3",
    inventory: mockInventory.find(i => i.menuItemId === "6"),
    ratings: mockRatings.filter(r => r.menuItemId === "6"),
    averageRating: 4,
  },
];

const initialAppSettings: AppSettings = {
  appName: "CaféSync",
  appDescription: "A next-generation café management system",
  logoUrl: "",
  primaryColor: "#8B5CF6",
  secondaryColor: "#D946EF",
  defaultPaymentMethods: ["Cash"],
  kitchenPassword: "kitchen123",
  adminPassword: "admin123",
  showNavbar: false,
};

interface AppContextType {
  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  branches: Branch[];
  addBranch: (branch: Omit<Branch, "id">) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "tokenNumber" | "createdAt" | "updatedAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: Order["status"], branchId: string) => void;
  receipts: Receipt[];
  selectedBranch: string;
  setSelectedBranch: (id: string) => void;
  analyticsData: AnalyticsData;
  refreshAnalytics: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  addDiscount: (itemId: string, percentage: number, code: string, isPublic: boolean) => void;
  removeDiscount: (itemId: string) => void;
  submitFeedback: (orderId: string, rating: number, comment?: string) => void;
  generatePDF: (receipt: Receipt) => void;
  sortMenuItems: (criteria: "price" | "rating", order: "asc" | "desc") => MenuItem[];
  updateInventory: (menuItemId: string, ingredientId: string, quantity: number) => void;
  checkInventoryLevels: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>(mockBranches[0].id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newValue;
    });
  };

  const checkInventoryLevels = () => {
    setMenuItems(prevItems => {
      return prevItems.map(item => {
        if (item.inventory) {
          const hasOutOfStockIngredients = item.inventory.ingredients.some(
            ingredient => !ingredient.inStock
          );
          
          if (hasOutOfStockIngredients || item.inventory.stockLevel === "out") {
            return { ...item, available: false };
          }
        }
        return item;
      });
    });
  };

  const updateInventory = (menuItemId: string, ingredientId: string, quantity: number) => {
    setMenuItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === menuItemId && item.inventory) {
          const updatedIngredients = item.inventory.ingredients.map(ing => {
            if (ing.id === ingredientId) {
              const newQuantity = ing.quantity - quantity;
              const inStock = newQuantity > 0;
              return {
                ...ing,
                quantity: newQuantity,
                inStock
              };
            }
            return ing;
          });
          
          let stockLevel: "high" | "medium" | "low" | "out" = "high";
          const lowestStockIngredient = updatedIngredients.reduce(
            (lowest, current) => {
              if (!current.inStock) return { ...current, inStock: false };
              if (lowest.inStock === false) return lowest;
              
              const currentPercentage = current.quantity / 100;
              const lowestPercentage = lowest.quantity / 100;
              
              return currentPercentage < lowestPercentage ? current : lowest;
            },
            updatedIngredients[0]
          );
          
          if (!lowestStockIngredient.inStock) {
            stockLevel = "out";
          } else if (lowestStockIngredient.quantity < 30) {
            stockLevel = "low";
          } else if (lowestStockIngredient.quantity < 70) {
            stockLevel = "medium";
          }
          
          return {
            ...item,
            inventory: {
              ...item.inventory,
              ingredients: updatedIngredients,
              stockLevel,
              lastUpdated: new Date().toISOString()
            },
            available: stockLevel !== "out"
          };
        }
        return item;
      });
    });
  };

  const addDiscount = (itemId: string, percentage: number, code: string, isPublic: boolean) => {
    setMenuItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const discountedPrice = Number((item.price * (1 - percentage / 100)).toFixed(2));
          return {
            ...item,
            discount: {
              percentage,
              code,
              isPublic
            },
            discountedPrice
          };
        }
        return item;
      });
    });
  };

  const removeDiscount = (itemId: string) => {
    setMenuItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const { discount, discountedPrice, ...rest } = item;
          return rest;
        }
        return item;
      });
    });
  };

  const submitFeedback = (orderId: string, rating: number, comment?: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            feedback: {
              rating,
              comment
            }
          };
        }
        return order;
      });
    });
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.items.forEach(orderItem => {
      const ratingId = Date.now().toString() + Math.random().toString(36).substring(2, 8);
      const newRating: Rating = {
        id: ratingId,
        menuItemId: orderItem.menuItemId,
        orderId,
        customerId: order.customerName,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      setMenuItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === orderItem.menuItemId) {
            const currentRatings = item.ratings || [];
            const updatedRatings = [...currentRatings, newRating];
            const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = updatedRatings.length > 0 
              ? Number((totalRating / updatedRatings.length).toFixed(1)) 
              : 0;
            
            return {
              ...item,
              ratings: updatedRatings,
              averageRating
            };
          }
          return item;
        });
      });
    });
  };

  const sortMenuItems = (criteria: "price" | "rating", order: "asc" | "desc") => {
    const sortedItems = [...menuItems];
    
    if (criteria === "price") {
      sortedItems.sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        return order === "asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (criteria === "rating") {
      sortedItems.sort((a, b) => {
        const ratingA = a.averageRating || 0;
        const ratingB = b.averageRating || 0;
        return order === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }
    
    return sortedItems;
  };

  const generatePDF = (receipt: Receipt) => {
    const doc = useJsPDF();
    
    doc.setFontSize(20);
    doc.text(`${appSettings.appName} - Receipt`, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Token: ${receipt.tokenNumber}`, 20, 40);
    doc.text(`Date: ${new Date(receipt.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Customer: ${receipt.customerName}`, 20, 60);
    doc.text(`Phone: ${receipt.customerPhone}`, 20, 70);
    doc.text(`Branch: ${receipt.branchName}`, 20, 80);
    doc.text(`Payment Method: ${receipt.paymentMethod}`, 20, 90);
    
    if (receipt.timeTaken) {
      doc.text(`Order Time: ${receipt.timeTaken}`, 20, 100);
    }
    
    const tableColumn = ["Item", "Price", "Quantity", "Total"];
    const tableRows = receipt.items.map(item => [
      item.name,
      `$${item.price.toFixed(2)}`,
      item.quantity.toString(),
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 110,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [139, 92, 246] },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Total: $${receipt.total.toFixed(2)}`, 150, finalY, { align: 'right' });
    
    doc.setFontSize(10);
    doc.text(`Thank you for your order!`, 105, finalY + 20, { align: 'center' });
    doc.text(`${appSettings.appDescription}`, 105, finalY + 30, { align: 'center' });
    
    doc.save(`receipt_${receipt.tokenNumber}.pdf`);
  };

  const calculateAnalytics = (): AnalyticsData => {
    const completedOrders = orders.filter(order => order.status === "completed");
    const rejectedOrders = orders.filter(order => order.status === "rejected");
    const acceptedOrders = orders.filter(
      order => order.status === "cooking" || order.status === "completed"
    );

    const serviceTimes = completedOrders
      .filter(order => order.acceptedAt && order.completedAt)
      .map(order => {
        const acceptedTime = new Date(order.acceptedAt!).getTime();
        const completedTime = new Date(order.completedAt!).getTime();
        return (completedTime - acceptedTime) / 60000;
      });

    const avgServiceTime = serviceTimes.length 
      ? (serviceTimes.reduce((a, b) => a + b, 0) / serviceTimes.length).toFixed(1)
      : "0";

    const itemCounts = completedOrders
      .flatMap(order => order.items)
      .reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

    const itemCountArray = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }));

    const mostOrderedItems = [...itemCountArray]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const leastOrderedItems = [...itemCountArray]
      .sort((a, b) => a.count - b.count)
      .slice(0, 5);

    const customerCounts = completedOrders.reduce((acc, order) => {
      const key = `${order.customerName}-${order.customerPhone}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const returningCustomers = Object.entries(customerCounts)
      .filter(([, count]) => count > 1)
      .map(([key, count]) => {
        const [name, phone] = key.split('-');
        return { name, phone, orderCount: count };
      })
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const paymentTrends = lastWeek.map(date => {
      const amount = completedOrders
        .filter(order => order.createdAt.startsWith(date))
        .reduce((acc, order) => acc + order.total, 0);
      return { date, amount };
    });

    const hourCounts = completedOrders.reduce((acc, order) => {
      const hour = new Date(order.createdAt).getHours();
      const hourFormatted = `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
      acc[hourFormatted] = (acc[hourFormatted] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakHours = Object.entries(hourCounts)
      .map(([hour, orderCount]) => ({ hour, orderCount }))
      .sort((a, b) => b.orderCount - a.orderCount);

    const inventoryAlerts = menuItems
      .filter(item => item.inventory && (item.inventory.stockLevel === "low" || item.inventory.stockLevel === "out"))
      .map(item => ({
        itemName: item.name,
        stockLevel: item.inventory!.stockLevel
      }));

    const topRatedItems = [...menuItems]
      .filter(item => item.averageRating)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        rating: item.averageRating || 0
      }));

    return {
      totalPayments: completedOrders.reduce((acc, order) => acc + order.total, 0),
      successfulPayments: completedOrders.length,
      completedOrders: completedOrders.length,
      rejectedOrders: rejectedOrders.length,
      acceptedOrders: acceptedOrders.length,
      averageServiceTime: `${avgServiceTime} mins`,
      mostOrderedItems,
      leastOrderedItems,
      returningCustomers,
      paymentTrends,
      peakHours,
      inventoryAlerts,
      topRatedItems
    };
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(calculateAnalytics());

  const refreshAnalytics = () => {
    setAnalyticsData(calculateAnalytics());
  };

  useEffect(() => {
    refreshAnalytics();
  }, [orders]);

  useEffect(() => {
    checkInventoryLevels();
  }, []);

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
  };

  const addBranch = (branch: Omit<Branch, "id">) => {
    const newBranch: Branch = {
      ...branch,
      id: Date.now().toString(),
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = (branch: Branch) => {
    setBranches(prev => prev.map(b => b.id === branch.id ? branch : b));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const addOrder = (orderData: Omit<Order, "id" | "tokenNumber" | "createdAt" | "updatedAt" | "status">) => {
    const now = new Date().toISOString();
    const tokenNumber = generateToken();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      tokenNumber,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      ...orderData,
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    orderData.items.forEach(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      if (menuItem && menuItem.inventory) {
        menuItem.inventory.ingredients.forEach(ingredient => {
          updateInventory(
            item.menuItemId,
            ingredient.id,
            ingredient.quantity * item.quantity / 10
          );
        });
      }
    });
    
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order["status"], branchId: string) => {
    const now = new Date().toISOString();
    
    setOrders(prev => 
      prev.map(order => {
        if (order.id !== id) return order;
        
        const updates: Partial<Order> = {
          status,
          updatedAt: now,
        };
        
        if (status === "cooking" && !order.acceptedAt) {
          updates.acceptedAt = now;
        }
        
        if (status === "completed" && !order.completedAt) {
          updates.completedAt = now;
          
          const completedOrder = {...order, ...updates, completedAt: now} as Order;
          const branch = branches.find(b => b.id === branchId);
          
          if (branch) {
            const timeTaken = order.acceptedAt
              ? `${((new Date(now).getTime() - new Date(order.acceptedAt).getTime()) / 60000).toFixed(1)} mins`
              : undefined;
              
            const newReceipt: Receipt = {
              id: Date.now().toString(),
              orderId: order.id,
              tokenNumber: order.tokenNumber,
              customerName: order.customerName,
              customerPhone: order.customerPhone,
              items: order.items,
              total: order.total,
              paymentMethod: order.paymentMethod,
              branchId: order.branchId,
              branchName: branch.name,
              createdAt: now,
              timeTaken,
            };
            
            setReceipts(prev => [...prev, newReceipt]);
          }
        }
        
        return { ...order, ...updates };
      })
    );
  };

  const value = {
    appSettings,
    updateAppSettings,
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    orders,
    addOrder,
    updateOrderStatus,
    receipts,
    selectedBranch,
    setSelectedBranch,
    analyticsData,
    refreshAnalytics,
    isDarkMode,
    toggleTheme,
    addDiscount,
    removeDiscount,
    submitFeedback,
    generatePDF,
    sortMenuItems,
    updateInventory,
    checkInventoryLevels,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
