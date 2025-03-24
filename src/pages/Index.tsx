
import React from 'react';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import Branches from '@/components/home/branches';
import { useAppContext } from '@/context/AppContext';

const Index = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
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
