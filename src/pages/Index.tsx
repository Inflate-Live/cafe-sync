
import React, { lazy, Suspense } from 'react';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/header';

// Lazy loaded components for better performance
const Hero = lazy(() => import('@/components/home/hero'));
const Features = lazy(() => import('@/components/home/features'));
const Branches = lazy(() => import('@/components/home/branches'));

// Fallback loading component
const SectionLoader = () => (
  <div className="w-full py-12 flex justify-center">
    <div className="animate-pulse w-full max-w-4xl h-64 bg-muted/20 rounded-lg"></div>
  </div>
);

const Index = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<SectionLoader />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Branches />
        </Suspense>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;
