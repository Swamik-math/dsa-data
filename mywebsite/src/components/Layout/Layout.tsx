import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "Join", path: "/join" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/95 shadow-lg"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform mr-12"
          >
            AIGETAI
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative font-medium transition-all ${
                  isActive(item.path)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <Link
            to="/login"
            className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-2 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-6 py-4 border-b border-gray-100 font-medium transition-all ${
                  isActive(item.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-center"
            >
              Login
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mt-20 min-h-[calc(100vh-160px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AIGETAI
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Transforming real estate through innovative technology and
                immersive virtual experiences.
              </p>
              <div className="flex gap-4">
                {["twitter", "linkedin", "facebook", "instagram"].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center hover:-translate-y-1 hover:scale-110 transition-all text-lg"
                  >
                    {social === "twitter" ? "🐦" :
                     social === "linkedin" ? "💼" :
                     social === "facebook" ? "📘" : "📸"}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    →<span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <div className="space-y-3 text-sm">
                {[
                  "Virtual Tours",
                  "Property Listings",
                  "AI Recommendations",
                  "Market Analysis",
                  "Investment Consulting"
                ].map((service) => (
                  <div key={service} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">
                    • {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe for latest property updates and market insights.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:-translate-y-1 transition-all text-sm">
                  Go
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p className="mb-4">© {new Date().getFullYear()} Aigetai Technologies. All rights reserved.</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
              <Link to="/sitemap" className="hover:text-blue-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
