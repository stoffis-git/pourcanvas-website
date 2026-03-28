import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const RootLayout = () => (
  <TooltipProvider>
    <ScrollToTop />
    <Toaster />
    <Sonner />
    <Outlet />
  </TooltipProvider>
);

export default RootLayout;
