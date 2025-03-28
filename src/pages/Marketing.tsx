
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/footer';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Check, X, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/ui/logo';

const Marketing = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  const features = [
    {
      category: "Ordering System",
      items: [
        { name: "Real-Time Updates", cafeSync: true, others: false },
        { name: "Multi-Branch Support", cafeSync: true, others: false },
        { name: "Customizable Menu", cafeSync: true, others: true },
        { name: "Digital Receipts", cafeSync: true, others: true },
        { name: "Order Tracking", cafeSync: true, others: true },
      ]
    },
    {
      category: "Kitchen Management",
      items: [
        { name: "Live Order Queue", cafeSync: true, others: true },
        { name: "Order Prioritization", cafeSync: true, others: false },
        { name: "Completion Tracking", cafeSync: true, others: false },
        { name: "Staff Assignment", cafeSync: true, others: false },
        { name: "Inventory Integration", cafeSync: true, others: true },
      ]
    },
    {
      category: "Business Operations",
      items: [
        { name: "Free & Open Source", cafeSync: true, others: false },
        { name: "One-Time Payment", cafeSync: true, others: false },
        { name: "No Monthly Fees", cafeSync: true, others: false },
        { name: "Self-Hosting Option", cafeSync: true, others: false },
        { name: "Detailed Analytics", cafeSync: true, others: true },
      ]
    }
  ];

  const downloads = [
    { platform: "Windows (x64)", icon: "windows", link: "https://github.com/Inflate-Live/cafe-verse-sync/releases/latest/download/Cafe-Verse-Sync-Setup-win-x64.exe" },
    { platform: "Windows (ARM64)", icon: "windows", link: "https://github.com/Inflate-Live/cafe-verse-sync/releases/latest/download/Cafe-Verse-Sync-Setup-win-arm64.exe" },
    { platform: "macOS", icon: "apple", link: "https://github.com/Inflate-Live/cafe-verse-sync/releases/latest/download/Cafe-Verse-Sync-mac.dmg" },
    { platform: "Linux (Debian/Ubuntu)", icon: "linux", link: "https://github.com/Inflate-Live/cafe-verse-sync/releases/latest/download/Cafe-Verse-Sync-linux-amd64.deb" },
    { platform: "Linux (ARM64)", icon: "linux", link: "https://github.com/Inflate-Live/cafe-verse-sync/releases/latest/download/Cafe-Verse-Sync-linux-arm64.deb" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8 flex justify-center">
              <Logo size="large" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Ultimate <span className="text-primary">Café Management System</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Streamline operations, boost efficiency, and enhance customer experience with our 
              fully customizable, multi-branch café management solution.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://github.com/Inflate-Live/cafe-verse-sync" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <Github size={20} />
                  View on GitHub
                </Button>
              </a>
              <a href="https://cafe-verse-sync.lovable.app" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="flex items-center gap-2">
                  <ExternalLink size={20} />
                  Try Live Demo
                </Button>
              </a>
              <Link to="/order">
                <Button size="lg" variant="secondary" className="flex items-center gap-2">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">All-in-One Solution</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                CaféSync provides everything you need to run your café or restaurant efficiently,
                from order taking to kitchen management and analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-primary text-2xl">🧾</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Order Management</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Intuitive interface for taking orders, customizing items, and processing payments.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Real-time order updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Automated receipt generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Custom menu items and modifiers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-primary text-2xl">👨‍🍳</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Kitchen Display</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Optimize kitchen operations with a dedicated order display system.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Priority-based ticket display</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Order preparation timing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Customizable kitchen stations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <span className="text-primary text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">Admin Controls</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Complete control over your café business with comprehensive management tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Multiple branch management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Sales and performance analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 h-5 w-5" />
                      <span>Staff access control</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">CaféSync vs. Other Systems</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                See how our solution compares to traditional café management systems.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[768px]">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="col-span-1"></div>
                  <div className="col-span-1 bg-primary/10 rounded-lg p-4 text-center">
                    <h3 className="font-bold text-xl text-primary">CaféSync</h3>
                  </div>
                  <div className="col-span-1 bg-muted rounded-lg p-4 text-center">
                    <h3 className="font-bold text-xl">Other Systems</h3>
                  </div>
                </div>

                {features.map((category, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="font-semibold text-lg mb-4 border-b pb-2">{category.category}</h3>
                    {category.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-4 py-2 border-b border-border/40">
                        <div className="col-span-1">{item.name}</div>
                        <div className="col-span-1 text-center">
                          {item.cafeSync ? (
                            <Check className="inline text-green-500 h-5 w-5" />
                          ) : (
                            <X className="inline text-red-500 h-5 w-5" />
                          )}
                        </div>
                        <div className="col-span-1 text-center">
                          {item.others ? (
                            <Check className="inline text-green-500 h-5 w-5" />
                          ) : (
                            <X className="inline text-red-500 h-5 w-5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Download CaféSync</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                CaféSync is available for all major operating systems. Choose your platform and get started today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {downloads.map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className="flex items-center p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:shadow-md hover:border-primary/50 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-6 w-6 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{item.platform}</p>
                    <p className="text-sm text-muted-foreground">Download Now</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center mt-10">
              <a 
                href="https://github.com/Inflate-Live/cafe-verse-sync/releases" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View all releases</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </div>
  );
};

export default Marketing;
