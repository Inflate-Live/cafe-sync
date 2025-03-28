
import React from 'react';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/header';
import Dashboard from '@/components/dashboard/dashboard';
import Hero from '@/components/home/hero';
import { Button } from '@/components/ui/button';
import { GitHub, ExternalLink } from 'lucide-react';

const Index = () => {
  const { isDarkMode, toggleTheme } = useAppContext();
  const isElectron = window.navigator.userAgent.toLowerCase().indexOf('electron') > -1;

  // For Electron app, just show the dashboard
  if (isElectron) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Dashboard />
        </main>
        <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      </div>
    );
  }

  // For web app, show the marketing page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Experience CaféSync Today</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://github.com/Inflate-Live/cafe-verse-sync" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <GitHub size={20} />
                  View on GitHub
                </Button>
              </a>
              <a href="https://cafe-verse-sync.lovable.app" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="flex items-center gap-2">
                  <ExternalLink size={20} />
                  Try Live Demo
                </Button>
              </a>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose CaféSync?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive café management solution provides everything you need to run your business efficiently.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Fast Implementation</h3>
                <p className="text-muted-foreground text-center">
                  Get up and running quickly with our intuitive setup process and user-friendly interface.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl">🔄</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Real-time Updates</h3>
                <p className="text-muted-foreground text-center">
                  Instant synchronization between customer orders and kitchen displays for seamless operations.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Comprehensive Analytics</h3>
                <p className="text-muted-foreground text-center">
                  Make data-driven decisions with detailed reports and insights about your café performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Index;
