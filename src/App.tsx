
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { lazy, Suspense } from "react";
import React from "react";

// Lazy load pages for performance optimization
const Index = lazy(() => import("./pages/Index"));
const Order = lazy(() => import("./pages/Order"));
const Kitchen = lazy(() => import("./pages/Kitchen"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RatingModal = lazy(() => import("./components/feedback/rating-modal"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="h-12 w-12 mx-auto bg-primary/20 rounded-full"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // Use a stable QueryClient instance
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/order" element={<Order />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <RatingModal />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
