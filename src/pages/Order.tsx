
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SectionTitle from '@/components/ui/section-title';

const Order = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-12">
          <SectionTitle 
            subtitle="Coming Soon"
            title="Order System Under Development"
            description="Our ordering system will be available soon. Stay tuned for a seamless ordering experience!"
          />
          
          <div className="flex justify-center mt-12">
            <button
              onClick={() => toast({
                title: "We're working on it!",
                description: "The ordering system will be available soon."
              })}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Notify Me When Ready
            </button>
          </div>
        </div>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Order;
