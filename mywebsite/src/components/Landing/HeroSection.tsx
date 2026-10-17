import React, { useEffect, useRef, useState } from "react";

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;

      if (backgroundRef.current) {
        const move = position * -0.5;
        const scale = 1 + position * 0.0005;
        backgroundRef.current.style.transform = `translateY(${move}px) scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const propertyImages = [1, 2, 3, 4, 5];

  return (
    <section
      ref={containerRef}
      className={`relative h-screen overflow-hidden bg-black transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/background.jpg)",
          filter: "brightness(0.6) contrast(1.2)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-blue-600/30 to-black/70 opacity-50 mix-blend-overlay" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-6">
        <h1 className={`text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`} style={{transitionDelay: "0.8s"}}>
          Discover Your Dream Property
        </h1>
        <p className={`text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`} style={{transitionDelay: "1.2s"}}>
          Experience immersive virtual tours and find your perfect home with AI-powered recommendations
        </p>
        <button className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-2xl transition-all animate-pulse transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`} style={{transitionDelay: "1.6s"}}>
          Explore Properties
        </button>
      </div>

      {/* Property Cards */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {propertyImages.map((num, index) => (
          <div
            key={num}
            className={`absolute w-32 h-32 rounded-lg border-2 border-white/90 shadow-2xl transition-all duration-1000 opacity-0 ${
              isLoaded ? "opacity-100" : ""
            }`}
            style={{
              backgroundImage: `url(/images/property${num}.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              left: `${10 + index * 18}%`,
              top: `${15 + index * 10}%`,
              transitionDelay: `${(0.5 + index * 0.15)}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
