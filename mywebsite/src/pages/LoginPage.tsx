import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SocialLogin {
  icon: string;
  name: string;
  color: string;
  bg: string;
}

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Login attempt:", loginData);
      setIsLoading(false);
      alert(activeTab === "login" ? "Login successful!" : "Account created!");
    }, 1500);
  };

  const socialLogins: SocialLogin[] = [
    { icon: "G", name: "Google", color: "#DB4437", bg: "#DB443720" },
    { icon: "f", name: "Facebook", color: "#4267B2", bg: "#4267B220" },
    { icon: "in", name: "LinkedIn", color: "#0077B5", bg: "#0077B520" },
    { icon: "git", name: "GitHub", color: "#333", bg: "#33333320" }
  ];

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-purple-700 to-purple-900 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl animate-float"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div
        className={`w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AIGETAI
          </div>
          <p className="text-gray-600 text-lg">
            {activeTab === "login" ? "Welcome back to your account" : "Join our community"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "login"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "signup"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Social Login */}
        <div className="mb-8">
          <p className="text-center text-gray-600 mb-4 text-sm">
            {activeTab === "login" ? "Sign in with" : "Sign up with"}
          </p>
          <div className="grid grid-cols-4 gap-3">
            {socialLogins.map((social, i) => (
              <button
                key={i}
                className="py-3 rounded-lg font-bold hover:-translate-y-1 transition-all"
                style={{ backgroundColor: social.bg, color: social.color }}
              >
                {social.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="px-3 text-gray-400 text-xs font-medium">OR CONTINUE WITH EMAIL</div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
              placeholder="you@example.com"
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none bg-white transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-700 font-medium text-sm">Password</label>
              {activeTab === "login" && (
                <Link
                  to="/forgot-password"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              placeholder="••••••••"
              minLength={8}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none bg-white transition-colors"
            />
            {activeTab === "signup" && (
              <p className="text-xs text-gray-500 mt-2">
                Must be at least 8 characters with letters and numbers
              </p>
            )}
          </div>

          {/* Remember Me / Terms */}
          {activeTab === "login" ? (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleLoginChange}
                className="w-5 h-5 accent-blue-600"
              />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm cursor-pointer">
                Remember me for 30 days
              </label>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-5 h-5 accent-blue-600 mt-1"
              />
              <label htmlFor="terms" className="text-gray-700 text-sm cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-80 relative"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              activeTab === "login" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        {/* Switch Prompt */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            {activeTab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              {activeTab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-1 font-medium">
            <span>🔒</span>
            <span>Bank-level Security</span>
          </div>
          <p>Your data is protected with 256-bit SSL encryption and GDPR compliance.</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
