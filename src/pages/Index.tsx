
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import Branches from '@/components/home/branches';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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

    // Show welcome toast
    setTimeout(() => {
      toast({
        title: "Welcome to CaféSync",
        description: "Explore the future of café management",
      });
    }, 1000);
  }, [toast]);

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
      <main className="flex-grow">
        <Hero />
        <Features />
        <Branches />
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;
