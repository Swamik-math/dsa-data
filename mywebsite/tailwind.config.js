/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#10b981",
      },
      animation: {
        zoomIn: "zoomIn 10s infinite alternate",
        fadeIn: "fadeIn 1s ease-out",
        slideUp: "slideUp 0.8s ease-out",
        jobHover: "jobHover 0.3s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        floatUp: "floatUp 3s ease-in-out infinite",
      },
      keyframes: {
        zoomIn: {
          "from": { transform: "scale(1)" },
          "to": { transform: "scale(1.1)" },
        },
        fadeIn: {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "from": { opacity: "0", transform: "translateY(40px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        jobHover: {
          "0%": {
            transform: "translateY(0)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          },
          "100%": {
            transform: "translateY(-10px)",
            boxShadow: "0 20px 50px rgba(59, 130, 246, 0.15)",
            borderColor: "rgba(59, 130, 246, 0.3)",
          },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
