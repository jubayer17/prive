import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import QuickBookWidget from "@/components/booking/QuickBookWidget";

// Admin pages don't need the public layout
const adminPages = ["SuperAdminDashboard", "AdminDashboard", "EditorDashboard"];

// Pages where Quick Book widget should be hidden
const hideQuickBookPages = [
  "Booking",
  "AdminDashboard",
  "SuperAdminDashboard",
  "EditorDashboard",
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isAdminPage = adminPages.includes(currentPageName);
  const showQuickBook = !hideQuickBookPages.includes(currentPageName);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPageName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      {showQuickBook && <QuickBookWidget />}
    </div>
  );
}
