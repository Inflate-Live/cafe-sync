
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Utensils, BarChart4, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Café Verse Sync Dashboard</h1>
        <p className="text-muted-foreground">
          Access all areas of your café management system from this central dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/order" className="w-full">
          <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-6 h-full transition-all hover:shadow-md flex flex-col items-center justify-center text-center gap-4">
            <Coffee className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Order System</h2>
              <p className="text-muted-foreground">Process customer orders, customize items, and complete transactions</p>
            </div>
            <Button className="mt-auto">Go to Orders</Button>
          </div>
        </Link>

        <Link to="/kitchen" className="w-full">
          <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-6 h-full transition-all hover:shadow-md flex flex-col items-center justify-center text-center gap-4">
            <Utensils className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Kitchen Display</h2>
              <p className="text-muted-foreground">View and manage incoming orders for kitchen staff</p>
            </div>
            <Button className="mt-auto">Go to Kitchen</Button>
          </div>
        </Link>

        <Link to="/admin" className="w-full">
          <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-6 h-full transition-all hover:shadow-md flex flex-col items-center justify-center text-center gap-4">
            <Settings className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
              <p className="text-muted-foreground">Manage menu items, branches, pricing, and system settings</p>
            </div>
            <Button className="mt-auto">Go to Admin</Button>
          </div>
        </Link>

        <div className="bg-muted border border-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center gap-4">
          <BarChart4 className="h-12 w-12 text-muted-foreground" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">View sales reports, customer insights, and business performance</p>
          </div>
          <Button variant="outline" className="mt-auto" disabled>Coming Soon</Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
