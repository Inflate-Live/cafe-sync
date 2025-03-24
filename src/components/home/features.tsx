
import React from 'react';
import SectionTitle from '../ui/section-title';
import { Check } from 'lucide-react';

const features = [
  {
    title: "Staff & Customer Ordering System",
    description: "An intuitive interface for browsing menus, placing orders, and tracking status in real-time.",
    items: [
      "Dynamic menu customization per branch",
      "Simple checkout with customer information",
      "Multiple payment method options",
      "Automatic token generation",
      "Digital receipts for all orders"
    ]
  },
  {
    title: "Kitchen Panel",
    description: "Streamline kitchen operations with a dedicated real-time order management system.",
    items: [
      "View all pending orders in real-time",
      "Accept, reject, or complete orders with one click",
      "Order timing tracking from acceptance to completion",
      "Secure access control with password protection",
      "Clear order prioritization"
    ]
  },
  {
    title: "Admin Control Center",
    description: "Complete control over your café business with comprehensive management tools.",
    items: [
      "Multi-branch management & customization",
      "Complete order & payment oversight",
      "Menu customization per branch",
      "Detailed analytics & performance tracking",
      "Configurable payment options with sandbox testing"
    ]
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionTitle 
          subtitle="Key Features"
          title="Everything You Need to Run Your Café"
          description="CaféSync combines powerful features with elegant simplicity to create the ultimate café management experience."
        />
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card rounded-xl p-8 transform transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              
              <ul className="space-y-3">
                {feature.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="text-primary shrink-0 mt-1 mr-3 w-5 h-5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
