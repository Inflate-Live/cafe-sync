
import React from 'react';
import SectionTitle from '../ui/section-title';

const Branches: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionTitle 
          subtitle="Multi-Branch System"
          title="Manage Your Entire Food Chain from One Place"
          description="CaféSync's powerful multi-branch system lets you control all locations while maintaining their unique identity."
        />
        
        <div className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-3xl transform -rotate-1"></div>
          <div className="relative glass-card p-8 md:p-12 rounded-3xl shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Unified Management, Unique Identities</h3>
                <p className="text-muted-foreground mb-8">
                  Each of your branches maintains its own unique menu, pricing, and operations while being seamlessly
                  connected to your central admin panel. Monitor performance across all locations or dive deep into
                  individual branch analytics.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-background/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Downtown Branch</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-800/30 dark:text-green-400">Active</span>
                    </div>
                    <div className="text-sm text-muted-foreground">123 Main Street • Opens 7AM - 9PM</div>
                  </div>
                  
                  <div className="bg-background/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Riverside Location</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-800/30 dark:text-green-400">Active</span>
                    </div>
                    <div className="text-sm text-muted-foreground">456 River View • Opens 8AM - 10PM</div>
                  </div>
                  
                  <div className="bg-background/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Mall Kiosk</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-800/30 dark:text-yellow-400">Opening Soon</span>
                    </div>
                    <div className="text-sm text-muted-foreground">789 Shopping Center • Coming Next Month</div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center p-6 glass-card rounded-xl max-w-xs animate-float">
                    <h3 className="text-xl font-bold mb-2">Branch Management</h3>
                    <p className="text-sm text-muted-foreground">Add, remove, or modify branches with a few clicks. Each branch can have its own unique settings and menu items.</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Branches;
