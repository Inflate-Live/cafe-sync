
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SectionTitle from '@/components/ui/section-title';
import { Lock } from 'lucide-react';

const Kitchen = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    // Check for user preference
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
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'kitchen123') {
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
              
              <SectionTitle 
                title="Kitchen Access"
                description="Please enter your kitchen password to access the kitchen panel."
                className="mb-6"
              />
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Enter kitchen password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default password: kitchen123</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Access Kitchen Panel
                </button>
              </form>
            </div>
          ) : (
            <>
              <SectionTitle 
                subtitle="Kitchen Panel"
                title="Order Management System"
                description="Manage all incoming orders from this central kitchen dashboard."
              />
              
              <div className="mt-12 glass-card p-8 rounded-xl">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No active orders at the moment.</p>
                  <button
                    onClick={() => toast({
                      title: "Coming Soon!",
                      description: "Full kitchen functionality will be available in the next update."
                    })}
                    className="mt-4 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Refresh Orders
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Kitchen;
