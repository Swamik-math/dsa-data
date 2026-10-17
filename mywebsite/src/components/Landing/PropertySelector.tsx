import React, { useState, useEffect, useRef } from "react";

interface Property {
  id: number;
  name: string;
  description: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  thumb: string;
  images: string[];
}

const PropertySelector: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const properties: Property[] = [
    {
      id: 1,
      name: "Modern Villa",
      description: "Luxury villa with ocean view and modern amenities",
      price: "$4,200,000",
      location: "Beverly Hills, CA",
      bedrooms: 4,
      bathrooms: 3,
      sqft: "2,500",
      thumb: "/images/property1.jpg",
      images: Array(5).fill("/images/property1.jpg")
    },
    {
      id: 2,
      name: "City Apartment",
      description: "Downtown apartment with premium amenities",
      price: "$3,500,000",
      location: "New York, NY",
      bedrooms: 3,
      bathrooms: 2,
      sqft: "1,800",
      thumb: "/images/property2.jpg",
      images: Array(5).fill("/images/property2.jpg")
    },
    {
      id: 3,
      name: "Beach House",
      description: "Beachfront property with private access",
      price: "$2,800,000",
      location: "Miami, FL",
      bedrooms: 3,
      bathrooms: 2,
      sqft: "2,200",
      thumb: "/images/property3.jpg",
      images: Array(5).fill("/images/property3.jpg")
    },
    {
      id: 4,
      name: "Mountain Cabin",
      description: "Cozy cabin with mountain views",
      price: "$1,900,000",
      location: "Aspen, CO",
      bedrooms: 3,
      bathrooms: 2,
      sqft: "1,600",
      thumb: "/images/property4.jpg",
      images: Array(5).fill("/images/property4.jpg")
    },
    {
      id: 5,
      name: "Urban Loft",
      description: "Modern loft in city center",
      price: "$2,300,000",
      location: "Chicago, IL",
      bedrooms: 2,
      bathrooms: 2,
      sqft: "1,500",
      thumb: "/images/property5.jpg",
      images: Array(5).fill("/images/property5.jpg")
    },
  ];

  const selectedProp = properties.find((p) => p.id === selectedProperty);

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-5 bg-gradient-to-br from-purple-700 to-purple-900 text-white transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className={`text-center mb-16 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.2s"}}>
          <h2 className="text-5xl font-bold mb-4 text-shadow">Featured Properties</h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Explore our exclusive collection of premium properties
          </p>
        </div>

        {/* Property Carousel */}
        <div className={`flex gap-6 overflow-x-auto pb-6 mb-12 scroll-smooth transition-all duration-600 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{transitionDelay: "0.3s"}}>
          {properties.map((property) => (
            <button
              key={property.id}
              onClick={() => {
                setSelectedProperty(property.id);
                setGalleryIndex(0);
              }}
              className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                selectedProperty === property.id
                  ? "scale-105 shadow-2xl shadow-white/50"
                  : "hover:scale-105 shadow-lg"
              }`}
            >
              <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${property.thumb})`}} />
              <div className="bg-white text-gray-900 p-4">
                <h3 className="font-bold text-lg mb-1">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.price}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Property Details */}
        {selectedProp && (
          <div className={`bg-white text-gray-900 rounded-2xl p-8 shadow-2xl transition-all duration-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`} style={{transitionDelay: "0.5s"}}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-4xl font-bold mb-2">{selectedProp.name}</h3>
                <p className="text-lg text-gray-600">📍 {selectedProp.location}</p>
              </div>
              <div className="text-3xl font-bold text-green-600 animate-float">{selectedProp.price}</div>
            </div>

            {/* Main Gallery */}
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg h-96 bg-gray-200 relative">
              <div
                className="w-full h-full bg-cover bg-center transition-all duration-500"
                style={{backgroundImage: `url(${selectedProp.images[galleryIndex]})`}}
              />
              {/* Gallery Dots */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {selectedProp.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setGalleryIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === galleryIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold mb-4">Property Gallery</h4>
              <div className="grid grid-cols-5 gap-4">
                {selectedProp.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setGalleryIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      index === galleryIndex ? "ring-2 ring-blue-600 scale-105" : ""
                    }`}
                    style={{backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center"}}
                  >
                    {index === galleryIndex && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white font-bold">
                        Active
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-l-4 border-blue-600">
              <h4 className="text-2xl font-bold mb-6">Property Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "🛏️", label: "Bedrooms", value: selectedProp.bedrooms },
                  { icon: "🛁", label: "Bathrooms", value: selectedProp.bathrooms },
                  { icon: "📐", label: "Sq Ft", value: selectedProp.sqft },
                  { icon: "📍", label: "Location", value: selectedProp.location.split(",")[0] }
                ].map((detail, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-3xl mb-2">{detail.icon}</div>
                    <div className="font-bold text-lg text-gray-900">{detail.value}</div>
                    <div className="text-sm text-gray-600">{detail.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
};

export default PropertySelector;
