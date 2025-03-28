
import React from 'react';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/header';
import Dashboard from '@/components/dashboard/dashboard';

const Index = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Dashboard />
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;
