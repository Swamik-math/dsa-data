import React from "react";
import HeroSection from "../components/Landing/HeroSection";
import PropertySelector from "../components/Landing/PropertySelector";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: "🏠",
      title: "Virtual Tours",
      description:
        "Experience properties through immersive 360° virtual tours from the comfort of your home.",
      color: "text-blue-500",
    },
    {
      icon: "🤝",
      title: "Expert Agents",
      description:
        "Connect with verified real estate professionals who understand your needs.",
      color: "text-green-500",
    },
    {
      icon: "🔒",
      title: "Secure Transactions",
      description:
        "Safe, transparent, and legally sound property transactions with full documentation.",
      color: "text-amber-500",
    },
  ];

  return (
    <div>
      <HeroSection />
      <PropertySelector />

      {/* Additional Features Section */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
              >
                <div className={`text-5xl mb-5`}>{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
