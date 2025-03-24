import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppSettings, 
  Branch, 
  MenuItem, 
  Order, 
  Receipt, 
  AnalyticsData,
  PaymentMethod
} from '@/types';
import { generateToken } from '@/lib/utils';

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

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Strong, concentrated coffee served in small doses",
    price: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1510707577719-ae7544227e3c?q=80&w=1000&auto=format&fit=crop",
    category: "Coffee",
    available: true,
    branchId: "1",
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
    };
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(calculateAnalytics());

  const refreshAnalytics = () => {
    setAnalyticsData(calculateAnalytics());
  };

  useEffect(() => {
    refreshAnalytics();
  }, [orders]);

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
