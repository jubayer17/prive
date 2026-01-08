import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Calendar,
  Phone,
  Clock,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { name: "Services", page: "Services" },
  { name: "Our Stylists", page: "Barbers" },
  { name: "Memberships", page: "Memberships" },
  { name: "Gift Cards", page: "GiftCards" },
  { name: "Gallery", page: "Reviews" },
  { name: "Blog", page: "Blog" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isHome =
    location.pathname === "/" || location.pathname.includes("home");

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
        }`}
      >
        <div className="bg-stone-900 text-stone-300 text-sm">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>(123) 456-7890</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Mon-Sat: 9AM - 8PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>123 Style Street, NY</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9/5 from 500+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "top-0" : "lg:top-10 top-0"
        } ${
          isScrolled || !isHome
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="relative z-10">
              <motion.div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isScrolled || !isHome ? "bg-stone-900" : "bg-amber-500"
                  }`}
                >
                  <span
                    className={`text-lg font-bold ${
                      isScrolled || !isHome ? "text-white" : "text-stone-900"
                    }`}
                  >
                    G
                  </span>
                </div>
                <h1
                  className={`text-2xl font-medium tracking-tight transition-colors duration-300 ${
                    isScrolled || !isHome ? "text-stone-900" : "text-white"
                  }`}
                >
                  Glowé
                </h1>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`text-sm font-medium transition-colors duration-300 hover:opacity-70 ${
                    location.pathname
                      .toLowerCase()
                      .includes(item.page.toLowerCase())
                      ? isScrolled || !isHome
                        ? "text-amber-600"
                        : "text-amber-400"
                      : isScrolled || !isHome
                      ? "text-stone-600 hover:text-stone-900"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to={createPageUrl("Profile")}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${
                    isScrolled || !isHome
                      ? "text-stone-600 hover:bg-stone-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Booking")}>
                <Button
                  className={`rounded-full px-6 ${
                    isScrolled || !isHome
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-900"
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled || !isHome ? "text-stone-900" : "text-white"
              }`}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl" />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative h-full flex flex-col items-center justify-center gap-8 pt-20 text-center"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.page}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full flex justify-center"
                >
                  <Link
                    to={createPageUrl(item.page)}
                    className="text-2xl font-light text-white hover:text-amber-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4 mt-8 w-full px-6"
              >
                <Link to={createPageUrl("Booking")} className="w-full max-w-xs">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-6 text-base rounded-full">
                    Book Appointment
                  </Button>
                </Link>
                <Link to={createPageUrl("Profile")} className="w-full max-w-xs">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base rounded-full"
                  >
                    My Account
                  </Button>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
