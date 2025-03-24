import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import { MenuItem, OrderItem, PaymentMethod } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Minus, Plus, Coffee } from 'lucide-react';

const Order = () => {
  const { 
    branches, 
    menuItems,
    selectedBranch,
    setSelectedBranch,
    addOrder,
    appSettings,
    isDarkMode,
    toggleTheme
  } = useAppContext();
  const { toast: hookToast } = useToast();
  
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<{
    tokenNumber: string;
    total: number;
    items: OrderItem[];
  } | null>(null);

  useEffect(() => {
    const branchMenuItems = menuItems.filter(
      item => item.branchId === selectedBranch && item.available
    );
    const uniqueCategories = [...new Set(branchMenuItems.map(item => item.category))];
    setCategories(uniqueCategories);
    
    if (uniqueCategories.length > 0 && !activeCategory) {
      setActiveCategory(uniqueCategories[0]);
    }
  }, [menuItems, selectedBranch]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItemId === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.menuItemId === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, {
          id: Date.now().toString(),
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        }];
      }
    });
    
    toast("Item added to cart", {
      description: `${item.name} has been added to your order`
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.menuItemId === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItemId !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty", {
        description: "Please add items to your cart before checking out"
      });
      return;
    }
    
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone) {
      toast.error("Missing information", {
        description: "Please provide your name and phone number"
      });
      return;
    }
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(customerPhone)) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid phone number in international format"
      });
      return;
    }
    
    const newOrder = addOrder({
      customerName,
      customerPhone,
      items: cart,
      total: calculateTotal(),
      paymentMethod,
      branchId: selectedBranch,
    });
    
    setReceipt({
      tokenNumber: newOrder.tokenNumber,
      total: newOrder.total,
      items: newOrder.items,
    });
    
    setCheckoutOpen(false);
    setReceiptOpen(true);
    
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const closeReceipt = () => {
    setReceiptOpen(false);
    setReceipt(null);
    
    hookToast({
      title: "Order placed successfully",
      description: `Your order token number is ${receipt?.tokenNumber}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{appSettings.appName} Order</h1>
            
            <Select 
              value={selectedBranch} 
              onValueChange={setSelectedBranch}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches
                  .filter(branch => branch.isActive)
                  .map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {branches.find(b => b.id === selectedBranch) && (
            <div className="glass-card p-4 rounded-xl mb-8">
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {branches.find(b => b.id === selectedBranch)?.name}
                </span> - Open {branches.find(b => b.id === selectedBranch)?.openingHours} to {branches.find(b => b.id === selectedBranch)?.closingHours}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {categories.length > 0 ? (
                <Tabs defaultValue={categories[0]} value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="mb-6">
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {categories.map(category => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {menuItems
                          .filter(item => 
                            item.category === category && 
                            item.branchId === selectedBranch &&
                            item.available
                          )
                          .map(item => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between">
                                  <span>{item.name}</span>
                                  <span className="text-primary">{formatCurrency(item.price)}</span>
                                </CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                              </CardHeader>
                              
                              {item.imageUrl && (
                                <CardContent className="p-4">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="w-full h-32 object-cover rounded-md"
                                  />
                                </CardContent>
                              )}
                              
                              <CardFooter>
                                <Button 
                                  onClick={() => addToCart(item)}
                                  className="w-full"
                                >
                                  Add to Order
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="text-center py-16">
                  <Coffee className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Menu Items Available</h3>
                  <p className="text-muted-foreground">
                    There are no menu items available for this branch.
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Order
                  </CardTitle>
                  <CardDescription>
                    {cart.length === 0 
                      ? "Your cart is empty" 
                      : `${cart.reduce((total, item) => total + item.quantity, 0)} item(s) in cart`
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Add items from the menu to start your order</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.menuItemId} className="flex justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.menuItemId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-6 text-center">{item.quantity}</span>
                            
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.menuItemId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive/90"
                              onClick={() => removeItem(item.menuItemId)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex-col gap-4">
                  <div className="w-full flex justify-between border-t pt-4">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Please provide your details to complete the order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="col-span-3"
                placeholder="Your name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="col-span-3"
                placeholder="+1234567890"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">
                Payment
              </Label>
              <Select 
                value={paymentMethod} 
                onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
              >
                <SelectTrigger className="col-span-3" id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {appSettings.defaultPaymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been sent to the kitchen.
            </DialogDescription>
          </DialogHeader>
          
          {receipt && (
            <div className="py-4">
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-bold">Token Number</h3>
                <p className="text-4xl font-bold text-primary">{receipt.tokenNumber}</p>
              </div>
              
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Order Summary</h4>
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(receipt.total)}</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Thank you for your order!</p>
                <p>Keep your token number handy to track your order.</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={closeReceipt} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Order;
