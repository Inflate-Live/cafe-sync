
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Check, X, Lock, Bell } from 'lucide-react';
import { formatCurrency, formatDate, calculateTimeDifference } from '@/lib/utils';
import { Order } from '@/types';
import { useRealTimeOrders } from '@/hooks/use-real-time-orders';
import { toast as sonnerToast } from 'sonner';

const Kitchen = () => {
  const { 
    branches, 
    updateOrderStatus, 
    appSettings,
    selectedBranch,
    setSelectedBranch,
    isDarkMode,
    toggleTheme
  } = useAppContext();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // Use our new real-time orders hook
  const {
    pendingOrders,
    cookingOrders,
    completedOrders,
    rejectedOrders,
    newOrderReceived
  } = useRealTimeOrders(selectedBranch);

  // Show a toast notification when new orders arrive
  React.useEffect(() => {
    if (newOrderReceived && authenticated) {
      sonnerToast("New Order Received", {
        description: "A new order has been placed",
        icon: <Bell className="h-4 w-4" />,
      });
    }
  }, [newOrderReceived, authenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === appSettings.kitchenPassword) {
      setAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Welcome to the Kitchen Panel"
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleOrderAction = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status, selectedBranch);
    
    toast({
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `Order #${id.slice(-4)} has been ${status}`
    });
  };

  const OrderCard = ({ order }: { order: Order }) => {
    return (
      <Card key={order.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Token: {order.tokenNumber}
              </CardTitle>
              <CardDescription>
                {order.customerName} • {order.customerPhone}
              </CardDescription>
            </div>
            
            <div className="text-right">
              <span className="block text-sm font-medium">
                {formatCurrency(order.total)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}× {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          {order.status === 'cooking' && order.acceptedAt && (
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                Cooking for: {calculateTimeDifference(order.acceptedAt, new Date().toISOString())}
              </span>
            </div>
          )}
          
          {order.status === 'completed' && order.acceptedAt && order.completedAt && (
            <div className="mt-3 flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                Completed in: {calculateTimeDifference(order.acceptedAt, order.completedAt)}
              </span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          {order.status === 'pending' && (
            <>
              <Button 
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => handleOrderAction(order.id, 'rejected')}
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                onClick={() => handleOrderAction(order.id, 'cooking')}
              >
                <Check className="w-4 h-4 mr-1" />
                Accept
              </Button>
            </>
          )}
          
          {order.status === 'cooking' && (
            <Button
              onClick={() => handleOrderAction(order.id, 'completed')}
            >
              <Check className="w-4 h-4 mr-1" />
              Complete
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          {!authenticated ? (
            <div className="max-w-md mx-auto glass-card p-8 rounded-xl">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">Kitchen Access</h2>
              <p className="text-muted-foreground text-center mb-6">
                Please enter your kitchen password to access the kitchen panel.
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-6">
                  <Input
                    type="password"
                    placeholder="Enter kitchen password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Access Kitchen Panel
                </Button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Kitchen Panel</h1>
                  <p className="text-muted-foreground">Manage all incoming orders from this dashboard.</p>
                </div>
                
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
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="pending" className="relative">
                    Pending Orders
                    {pendingOrders.length > 0 && (
                      <span className={`absolute -top-2 -right-2 ${newOrderReceived ? 'animate-ping bg-red-500' : 'bg-primary'} text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center`}>
                        {pendingOrders.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="cooking" className="relative">
                    Cooking
                    {cookingOrders.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                        {cookingOrders.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-1">No Pending Orders</h3>
                      <p className="text-muted-foreground">No new orders waiting to be accepted.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cooking">
                  {cookingOrders.length > 0 ? (
                    cookingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-1">No Orders Being Cooked</h3>
                      <p className="text-muted-foreground">There are no orders currently being prepared.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  {completedOrders.length > 0 ? (
                    completedOrders.map(order => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div className="text-center py-12">
                      <Check className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-1">No Completed Orders</h3>
                      <p className="text-muted-foreground">There are no completed orders yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {rejectedOrders.length > 0 ? (
                    rejectedOrders.map(order => <OrderCard key={order.id} order={order} />)
                  ) : (
                    <div className="text-center py-12">
                      <X className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-xl font-medium mb-1">No Rejected Orders</h3>
                      <p className="text-muted-foreground">There are no rejected orders.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Kitchen;
