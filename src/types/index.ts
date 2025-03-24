
export type PaymentMethod = "Cash" | "Card" | "PayPal" | "UPI" | "Other";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  available: boolean;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  openingHours: string;
  closingHours: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  tokenNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: "pending" | "cooking" | "completed" | "rejected";
  total: number;
  paymentMethod: PaymentMethod;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Receipt {
  id: string;
  orderId: string;
  tokenNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  branchId: string;
  branchName: string;
  createdAt: string;
  timeTaken?: string;
}

export interface AppSettings {
  appName: string;
  appDescription: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  defaultPaymentMethods: PaymentMethod[];
  kitchenPassword: string;
  adminPassword: string;
}

export interface AnalyticsData {
  totalPayments: number;
  successfulPayments: number;
  completedOrders: number;
  rejectedOrders: number;
  acceptedOrders: number;
  averageServiceTime: string;
  mostOrderedItems: { name: string; count: number }[];
  leastOrderedItems: { name: string; count: number }[];
  returningCustomers: { name: string; phone: string; orderCount: number }[];
  paymentTrends: { date: string; amount: number }[];
  peakHours: { hour: string; orderCount: number }[];
}
