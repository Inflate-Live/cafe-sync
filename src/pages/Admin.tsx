
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  CheckCircle,
  Coffee,
  Edit,
  File,
  Lock,
  PlusCircle,
  Settings,
  ShoppingBag,
  Store,
  Trash,
  Users,
  XCircle,
} from 'lucide-react';
import { PaymentMethod, Branch, MenuItem, AnalyticsData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Admin = () => {
  const { 
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
    receipts,
    analyticsData,
    refreshAnalytics,
    isDarkMode,
    toggleTheme
  } = useAppContext();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<Omit<Branch, "id">>({
    name: "",
    location: "",
    openingHours: "",
    closingHours: "",
    isActive: true,
  });
  
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    available: true,
    branchId: branches[0]?.id || "",
    imageUrl: "",
  });
  
  const [tempSettings, setTempSettings] = useState({...appSettings});
  const [editingPaymentMethods, setEditingPaymentMethods] = useState<Record<PaymentMethod, boolean>>({
    Cash: appSettings.defaultPaymentMethods.includes("Cash"),
    Card: appSettings.defaultPaymentMethods.includes("Card"),
    PayPal: appSettings.defaultPaymentMethods.includes("PayPal"),
    UPI: appSettings.defaultPaymentMethods.includes("UPI"),
    Other: appSettings.defaultPaymentMethods.includes("Other"),
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === appSettings.adminPassword) {
      setAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Welcome to the Admin Panel"
      });
      
      // Initialize temporary settings
      setTempSettings({...appSettings});
    } else {
      toast({
        title: "Authentication Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Branch management
  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.location) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and location for the new branch.",
        variant: "destructive"
      });
      return;
    }
    
    addBranch(newBranch);
    
    toast({
      title: "Branch Added",
      description: `${newBranch.name} has been added successfully.`
    });
    
    // Reset the form
    setNewBranch({
      name: "",
      location: "",
      openingHours: "",
      closingHours: "",
      isActive: true,
    });
  };
  
  const handleUpdateBranch = () => {
    if (!editingBranch) return;
    
    updateBranch(editingBranch);
    
    toast({
      title: "Branch Updated",
      description: `${editingBranch.name} has been updated successfully.`
    });
    
    setEditingBranch(null);
  };
  
  const handleDeleteBranch = (id: string) => {
    deleteBranch(id);
    
    toast({
      title: "Branch Deleted",
      description: "The branch has been deleted successfully."
    });
  };
  
  // Menu item management
  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.category || newMenuItem.price <= 0) {
      toast({
        title: "Missing Information",
        description: "Please provide name, category, and a valid price for the new menu item.",
        variant: "destructive"
      });
      return;
    }
    
    addMenuItem(newMenuItem);
    
    toast({
      title: "Menu Item Added",
      description: `${newMenuItem.name} has been added successfully.`
    });
    
    // Reset the form
    setNewMenuItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      available: true,
      branchId: branches[0]?.id || "",
      imageUrl: "",
    });
  };
  
  const handleUpdateMenuItem = () => {
    if (!editingMenuItem) return;
    
    updateMenuItem(editingMenuItem);
    
    toast({
      title: "Menu Item Updated",
      description: `${editingMenuItem.name} has been updated successfully.`
    });
    
    setEditingMenuItem(null);
  };
  
  const handleDeleteMenuItem = (id: string) => {
    deleteMenuItem(id);
    
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been deleted successfully."
    });
  };
  
  // Settings management
  const handleSaveSettings = () => {
    // Update payment methods
    const newPaymentMethods: PaymentMethod[] = [];
    
    if (editingPaymentMethods.Cash) newPaymentMethods.push("Cash");
    if (editingPaymentMethods.Card) newPaymentMethods.push("Card");
    if (editingPaymentMethods.PayPal) newPaymentMethods.push("PayPal");
    if (editingPaymentMethods.UPI) newPaymentMethods.push("UPI");
    if (editingPaymentMethods.Other) newPaymentMethods.push("Other");
    
    const updatedSettings = {
      ...tempSettings,
      defaultPaymentMethods: newPaymentMethods,
    };
    
    updateAppSettings(updatedSettings);
    
    toast({
      title: "Settings Updated",
      description: "Application settings have been updated successfully."
    });
  };
  
  // Analytics helpers
  const renderPaymentChart = (data: AnalyticsData) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data.paymentTrends}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <RechartsTooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#8B5CF6" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  const renderPeakHoursChart = (data: AnalyticsData) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data.peakHours}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="hour" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <RechartsTooltip formatter={(value: number) => [`${value}`, "Orders"]} />
          <Bar dataKey="orderCount" fill="#8B5CF6" />
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  };
  
  const renderOrderStatusChart = (data: AnalyticsData) => {
    const pieData = [
      { name: "Completed", value: data.completedOrders },
      { name: "Rejected", value: data.rejectedOrders },
      { name: "Cooking", value: data.acceptedOrders - data.completedOrders },
    ];
    
    const COLORS = ["#8B5CF6", "#EF4444", "#F59E0B"];
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value: number) => [`${value}`, "Orders"]} />
        </PieChart>
      </ResponsiveContainer>
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
              
              <h2 className="text-2xl font-bold text-center mb-2">Admin Access</h2>
              <p className="text-muted-foreground text-center mb-6">
                Please enter your admin password to access the admin panel.
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-6">
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default password: admin123</p>
                </div>
                
                <Button type="submit" className="w-full">
                  Access Admin Panel
                </Button>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground">
                  Manage your entire café business from this centralized dashboard.
                </p>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 flex flex-wrap gap-2">
                  <TabsTrigger value="dashboard" className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="branches" className="flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    Branches
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="flex items-center gap-1">
                    <Coffee className="w-4 h-4" />
                    Menu
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="receipts" className="flex items-center gap-1">
                    <File className="w-4 h-4" />
                    Receipts
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Dashboard Tab */}
                <TabsContent value="dashboard">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold">
                          {formatCurrency(analyticsData.totalPayments)}
                        </CardTitle>
                        <CardDescription>Total Revenue</CardDescription>
                      </CardHeader>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold">
                          {analyticsData.completedOrders}
                        </CardTitle>
                        <CardDescription>Completed Orders</CardDescription>
                      </CardHeader>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl font-bold">
                          {analyticsData.averageServiceTime}
                        </CardTitle>
                        <CardDescription>Average Service Time</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Trends</CardTitle>
                        <CardDescription>Revenue over the last 7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {renderPaymentChart(analyticsData)}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Peak Hours</CardTitle>
                        <CardDescription>Most active ordering hours</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {renderPeakHoursChart(analyticsData)}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>Distribution of order statuses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {renderOrderStatusChart(analyticsData)}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Most Popular Items</CardTitle>
                        <CardDescription>Items with highest order count</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analyticsData.mostOrderedItems.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span className="font-medium">{item.name}</span>
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {item.count} orders
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Returning Customers</CardTitle>
                        <CardDescription>Customers with multiple orders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analyticsData.returningCustomers.map((customer, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span className="font-medium">{customer.name}</span>
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {customer.orderCount} visits
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={refreshAnalytics}
                      className="w-full md:w-auto"
                    >
                      Refresh Analytics
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Branches Tab */}
                <TabsContent value="branches">
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Branch</CardTitle>
                        <CardDescription>Create a new location for your business</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="branch-name">Branch Name</Label>
                            <Input
                              id="branch-name"
                              value={newBranch.name}
                              onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                              placeholder="Downtown Branch"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="branch-location">Location</Label>
                            <Input
                              id="branch-location"
                              value={newBranch.location}
                              onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
                              placeholder="123 Main Street"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="opening-hours">Opening Hours</Label>
                            <Input
                              id="opening-hours"
                              value={newBranch.openingHours}
                              onChange={(e) => setNewBranch({...newBranch, openingHours: e.target.value})}
                              placeholder="9AM"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="closing-hours">Closing Hours</Label>
                            <Input
                              id="closing-hours"
                              value={newBranch.closingHours}
                              onChange={(e) => setNewBranch({...newBranch, closingHours: e.target.value})}
                              placeholder="9PM"
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="branch-active"
                              checked={newBranch.isActive}
                              onCheckedChange={(checked) => setNewBranch({...newBranch, isActive: checked})}
                            />
                            <Label htmlFor="branch-active">Branch Active</Label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={handleAddBranch}>Add Branch</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">Manage Branches</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map(branch => (
                      <Card key={branch.id}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle>{branch.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setEditingBranch({...branch})}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Branch</DialogTitle>
                                    <DialogDescription>
                                      Make changes to this branch location.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {editingBranch && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-name">Branch Name</Label>
                                        <Input
                                          id="edit-name"
                                          value={editingBranch.name}
                                          onChange={(e) => setEditingBranch({
                                            ...editingBranch, 
                                            name: e.target.value
                                          })}
                                        />
                                      </div>
                                      
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-location">Location</Label>
                                        <Input
                                          id="edit-location"
                                          value={editingBranch.location}
                                          onChange={(e) => setEditingBranch({
                                            ...editingBranch, 
                                            location: e.target.value
                                          })}
                                        />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-opening">Opening Hours</Label>
                                          <Input
                                            id="edit-opening"
                                            value={editingBranch.openingHours}
                                            onChange={(e) => setEditingBranch({
                                              ...editingBranch, 
                                              openingHours: e.target.value
                                            })}
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-closing">Closing Hours</Label>
                                          <Input
                                            id="edit-closing"
                                            value={editingBranch.closingHours}
                                            onChange={(e) => setEditingBranch({
                                              ...editingBranch, 
                                              closingHours: e.target.value
                                            })}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id="edit-active"
                                          checked={editingBranch.isActive}
                                          onCheckedChange={(checked) => setEditingBranch({
                                            ...editingBranch, 
                                            isActive: checked
                                          })}
                                        />
                                        <Label htmlFor="edit-active">Branch Active</Label>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingBranch(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateBranch}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Branch</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this branch? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteBranch(branch.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <CardDescription>{branch.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Hours:</span>
                              <span>{branch.openingHours} - {branch.closingHours}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`${branch.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                                {branch.isActive ? 'Active' : 'Coming Soon'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Menu Items:</span>
                              <span>
                                {menuItems.filter(item => item.branchId === branch.id).length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Menu Tab */}
                <TabsContent value="menu">
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Menu Item</CardTitle>
                        <CardDescription>Create a new item for your menu</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="item-name">Item Name</Label>
                              <Input
                                id="item-name"
                                value={newMenuItem.name}
                                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                                placeholder="Cappuccino"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="item-category">Category</Label>
                              <Input
                                id="item-category"
                                value={newMenuItem.category}
                                onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                                placeholder="Coffee"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="item-price">Price</Label>
                              <Input
                                id="item-price"
                                type="number"
                                value={newMenuItem.price || ""}
                                onChange={(e) => setNewMenuItem({
                                  ...newMenuItem, 
                                  price: parseFloat(e.target.value) || 0
                                })}
                                placeholder="4.50"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="item-branch">Branch</Label>
                              <select
                                id="item-branch"
                                value={newMenuItem.branchId}
                                onChange={(e) => setNewMenuItem({...newMenuItem, branchId: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                              >
                                {branches.map(branch => (
                                  <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label htmlFor="item-description">Description</Label>
                              <Textarea
                                id="item-description"
                                value={newMenuItem.description}
                                onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                                placeholder="Espresso with steamed milk and foam"
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label htmlFor="item-image">Image URL</Label>
                              <Input
                                id="item-image"
                                value={newMenuItem.imageUrl}
                                onChange={(e) => setNewMenuItem({...newMenuItem, imageUrl: e.target.value})}
                                placeholder="https://example.com/image.jpg"
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="item-available"
                                checked={newMenuItem.available}
                                onCheckedChange={(checked) => setNewMenuItem({...newMenuItem, available: checked})}
                              />
                              <Label htmlFor="item-available">Item Available</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={handleAddMenuItem}>Add Menu Item</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">Manage Menu Items</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map(item => (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle>{item.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setEditingMenuItem({...item})}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Menu Item</DialogTitle>
                                    <DialogDescription>
                                      Make changes to this menu item.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {editingMenuItem && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-item-name">Item Name</Label>
                                          <Input
                                            id="edit-item-name"
                                            value={editingMenuItem.name}
                                            onChange={(e) => setEditingMenuItem({
                                              ...editingMenuItem, 
                                              name: e.target.value
                                            })}
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-item-category">Category</Label>
                                          <Input
                                            id="edit-item-category"
                                            value={editingMenuItem.category}
                                            onChange={(e) => setEditingMenuItem({
                                              ...editingMenuItem, 
                                              category: e.target.value
                                            })}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-item-price">Price</Label>
                                          <Input
                                            id="edit-item-price"
                                            type="number"
                                            value={editingMenuItem.price || ""}
                                            onChange={(e) => setEditingMenuItem({
                                              ...editingMenuItem, 
                                              price: parseFloat(e.target.value) || 0
                                            })}
                                          />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-item-branch">Branch</Label>
                                          <select
                                            id="edit-item-branch"
                                            value={editingMenuItem.branchId}
                                            onChange={(e) => setEditingMenuItem({
                                              ...editingMenuItem, 
                                              branchId: e.target.value
                                            })}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                          >
                                            {branches.map(branch => (
                                              <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-item-description">Description</Label>
                                        <Textarea
                                          id="edit-item-description"
                                          value={editingMenuItem.description}
                                          onChange={(e) => setEditingMenuItem({
                                            ...editingMenuItem, 
                                            description: e.target.value
                                          })}
                                        />
                                      </div>
                                      
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-item-image">Image URL</Label>
                                        <Input
                                          id="edit-item-image"
                                          value={editingMenuItem.imageUrl}
                                          onChange={(e) => setEditingMenuItem({
                                            ...editingMenuItem, 
                                            imageUrl: e.target.value
                                          })}
                                        />
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          id="edit-item-available"
                                          checked={editingMenuItem.available}
                                          onCheckedChange={(checked) => setEditingMenuItem({
                                            ...editingMenuItem, 
                                            available: checked
                                          })}
                                        />
                                        <Label htmlFor="edit-item-available">Item Available</Label>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingMenuItem(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateMenuItem}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Menu Item</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this menu item? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteMenuItem(item.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <CardDescription>{item.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {item.imageUrl && (
                            <div className="mb-4">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Price:</span>
                              <span className="font-medium">{formatCurrency(item.price)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Branch:</span>
                              <span>
                                {branches.find(b => b.id === item.branchId)?.name || 'Unknown'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className={`${item.available ? 'text-green-500' : 'text-amber-500'}`}>
                                {item.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>
                          View and manage all orders across all branches
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {orders.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Token</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {orders.map(order => (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">{order.tokenNumber}</TableCell>
                                  <TableCell>{order.customerName}</TableCell>
                                  <TableCell>
                                    {branches.find(b => b.id === order.branchId)?.name || 'Unknown'}
                                  </TableCell>
                                  <TableCell>{formatCurrency(order.total)}</TableCell>
                                  <TableCell>
                                    <span className={`
                                      px-2 py-1 rounded-full text-xs font-medium
                                      ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' : ''}
                                      ${order.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400' : ''}
                                      ${order.status === 'cooking' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-400' : ''}
                                      ${order.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400' : ''}
                                    `}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </TableCell>
                                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                            <h3 className="text-xl font-medium mb-1">No Orders Yet</h3>
                            <p className="text-muted-foreground">Orders will appear here once customers place them.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <CardTitle>Completed Orders</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">
                          {orders.filter(order => order.status === 'completed').length}
                        </div>
                        <CardDescription>
                          Total value: {formatCurrency(
                            orders
                              .filter(order => order.status === 'completed')
                              .reduce((sum, order) => sum + order.total, 0)
                          )}
                        </CardDescription>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <CardTitle>Unique Customers</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">
                          {new Set(orders.map(order => order.customerPhone)).size}
                        </div>
                        <CardDescription>
                          Customers who have placed orders
                        </CardDescription>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <CardTitle>Rejected Orders</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">
                          {orders.filter(order => order.status === 'rejected').length}
                        </div>
                        <CardDescription>
                          Total value: {formatCurrency(
                            orders
                              .filter(order => order.status === 'rejected')
                              .reduce((sum, order) => sum + order.total, 0)
                          )}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Receipts Tab */}
                <TabsContent value="receipts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Digital Receipts</CardTitle>
                      <CardDescription>
                        All receipts for completed orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {receipts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Token</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {receipts.map(receipt => (
                              <TableRow key={receipt.id}>
                                <TableCell className="font-medium">{receipt.tokenNumber}</TableCell>
                                <TableCell>{receipt.customerName}</TableCell>
                                <TableCell>{receipt.branchName}</TableCell>
                                <TableCell>{receipt.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                                <TableCell>{formatCurrency(receipt.total)}</TableCell>
                                <TableCell>{new Date(receipt.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        View
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Receipt #{receipt.tokenNumber}</DialogTitle>
                                        <DialogDescription>
                                          {new Date(receipt.createdAt).toLocaleString()}
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Customer Details</h4>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Name:</span>
                                              <span>{receipt.customerName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Phone:</span>
                                              <span>{receipt.customerPhone}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">Order Details</h4>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Branch:</span>
                                              <span>{receipt.branchName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Payment Method:</span>
                                              <span>{receipt.paymentMethod}</span>
                                            </div>
                                            {receipt.timeTaken && (
                                              <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Preparation Time:</span>
                                                <span>{receipt.timeTaken}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">Items</h4>
                                          <div className="border rounded-lg p-3 space-y-2">
                                            {receipt.items.map((item, idx) => (
                                              <div key={idx} className="flex justify-between text-sm">
                                                <span>{item.quantity}× {item.name}</span>
                                                <span>{formatCurrency(item.price * item.quantity)}</span>
                                              </div>
                                            ))}
                                            <div className="border-t pt-2 flex justify-between font-medium">
                                              <span>Total</span>
                                              <span>{formatCurrency(receipt.total)}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button>
                                          Download PDF
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8">
                          <File className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <h3 className="text-xl font-medium mb-1">No Receipts Yet</h3>
                          <p className="text-muted-foreground">Receipts are generated when orders are completed.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Business Information</CardTitle>
                          <CardDescription>Customize your business branding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="app-name">Application Name</Label>
                            <Input
                              id="app-name"
                              value={tempSettings.appName}
                              onChange={(e) => setTempSettings({...tempSettings, appName: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="app-description">Application Description</Label>
                            <Textarea
                              id="app-description"
                              value={tempSettings.appDescription}
                              onChange={(e) => setTempSettings({...tempSettings, appDescription: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="logo-url">Logo URL</Label>
                            <Input
                              id="logo-url"
                              value={tempSettings.logoUrl}
                              onChange={(e) => setTempSettings({...tempSettings, logoUrl: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="primary-color">Primary Color</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id="primary-color"
                                  type="color"
                                  value={tempSettings.primaryColor}
                                  onChange={(e) => setTempSettings({...tempSettings, primaryColor: e.target.value})}
                                  className="w-10 h-10 p-1"
                                />
                                <Input
                                  value={tempSettings.primaryColor}
                                  onChange={(e) => setTempSettings({...tempSettings, primaryColor: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="secondary-color">Secondary Color</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  id="secondary-color"
                                  type="color"
                                  value={tempSettings.secondaryColor}
                                  onChange={(e) => setTempSettings({...tempSettings, secondaryColor: e.target.value})}
                                  className="w-10 h-10 p-1"
                                />
                                <Input
                                  value={tempSettings.secondaryColor}
                                  onChange={(e) => setTempSettings({...tempSettings, secondaryColor: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Methods</CardTitle>
                          <CardDescription>Configure available payment options</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="payment-cash">Cash</Label>
                              <p className="text-sm text-muted-foreground">Accept cash payments</p>
                            </div>
                            <Switch
                              id="payment-cash"
                              checked={editingPaymentMethods.Cash}
                              onCheckedChange={(checked) => 
                                setEditingPaymentMethods({...editingPaymentMethods, Cash: checked})
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="payment-card">Card Payments</Label>
                              <p className="text-sm text-muted-foreground">Accept credit/debit cards</p>
                            </div>
                            <Switch
                              id="payment-card"
                              checked={editingPaymentMethods.Card}
                              onCheckedChange={(checked) => 
                                setEditingPaymentMethods({...editingPaymentMethods, Card: checked})
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="payment-paypal">PayPal</Label>
                              <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                            </div>
                            <Switch
                              id="payment-paypal"
                              checked={editingPaymentMethods.PayPal}
                              onCheckedChange={(checked) => 
                                setEditingPaymentMethods({...editingPaymentMethods, PayPal: checked})
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="payment-upi">UPI</Label>
                              <p className="text-sm text-muted-foreground">Accept UPI payments</p>
                            </div>
                            <Switch
                              id="payment-upi"
                              checked={editingPaymentMethods.UPI}
                              onCheckedChange={(checked) => 
                                setEditingPaymentMethods({...editingPaymentMethods, UPI: checked})
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="payment-other">Other Methods</Label>
                              <p className="text-sm text-muted-foreground">Other payment options</p>
                            </div>
                            <Switch
                              id="payment-other"
                              checked={editingPaymentMethods.Other}
                              onCheckedChange={(checked) => 
                                setEditingPaymentMethods({...editingPaymentMethods, Other: checked})
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Access Control</CardTitle>
                          <CardDescription>Manage passwords for staff access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="kitchen-password">Kitchen Panel Password</Label>
                            <Input
                              id="kitchen-password"
                              type="password"
                              value={tempSettings.kitchenPassword}
                              onChange={(e) => setTempSettings({...tempSettings, kitchenPassword: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="admin-password">Admin Panel Password</Label>
                            <Input
                              id="admin-password"
                              type="password"
                              value={tempSettings.adminPassword}
                              onChange={(e) => setTempSettings({...tempSettings, adminPassword: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                      Save All Settings
                    </Button>
                  </div>
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

export default Admin;
