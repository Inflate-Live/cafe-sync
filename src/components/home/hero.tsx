
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Utensils, BarChart4 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen pt-24 pb-12 flex items-center overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full uppercase animate-fade-in">
              Introducing CaféSync
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
              The Ultimate Café Management System
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
              Streamline operations, boost efficiency, and enhance customer experience with our fully customizable, multi-branch café management solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/order"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl transform -rotate-3 scale-95"></div>
            <div className="relative glass-card p-8 rounded-3xl shadow-xl animate-scale-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-background/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform animate-float">
                  <Coffee className="text-primary w-12 h-12 mb-4" />
                  <h3 className="font-bold mb-2">Multi-Branch</h3>
                  <p className="text-sm text-muted-foreground">Manage all your café branches from one central dashboard</p>
                </div>
                <div className="bg-background/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform animate-float float-animation-delay-1">
                  <Utensils className="text-primary w-12 h-12 mb-4" />
                  <h3 className="font-bold mb-2">Real-Time Orders</h3>
                  <p className="text-sm text-muted-foreground">Instant order updates between customers and kitchen staff</p>
                </div>
                <div className="bg-background/60 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform animate-float float-animation-delay-2">
                  <BarChart4 className="text-primary w-12 h-12 mb-4" />
                  <h3 className="font-bold mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive insights for better business decisions</p>
                </div>
                <div className="bg-accent/10 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform animate-float float-animation-delay-3">
                  <span className="text-4xl mb-2">🎨</span>
                  <h3 className="font-bold mb-2">Customizable</h3>
                  <p className="text-sm text-muted-foreground">Tailor the system to match your brand identity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
