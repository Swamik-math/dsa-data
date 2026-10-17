import React, { useState } from "react";

interface Property {
  id: number;
  name: string;
  thumb: string;
  gallery: string[];
}

const ImageGalleryTest: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const properties: Property[] = [
    {
      id: 1,
      name: "Modern Villa",
      thumb: "/images/property1.jpg",
      gallery: Array(5).fill("/images/property1.jpg")
    },
    {
      id: 2,
      name: "City Apartment",
      thumb: "/images/property2.jpg",
      gallery: Array(5).fill("/images/property2.jpg")
    },
    {
      id: 3,
      name: "Beach House",
      thumb: "/images/property3.jpg",
      gallery: Array(5).fill("/images/property3.jpg")
    },
    {
      id: 4,
      name: "Mountain Cabin",
      thumb: "/images/property4.jpg",
      gallery: Array(5).fill("/images/property4.jpg")
    },
    {
      id: 5,
      name: "Urban Loft",
      thumb: "/images/property5.jpg",
      gallery: Array(5).fill("/images/property5.jpg")
    }
  ];

  const selectedProp = properties.find((p) => p.id === selectedProperty);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-12 text-gray-900">
        Image Gallery Test
      </h1>

      {/* Property Selector */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {properties.map((prop) => (
          <button
            key={prop.id}
            onClick={() => {
              setSelectedProperty(prop.id);
              setSelectedImage(0);
            }}
            className={`px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 transition-all ${
              selectedProperty === prop.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-900 hover:bg-blue-50"
            }`}
          >
            {prop.name}
          </button>
        ))}
      </div>

      {/* Gallery View */}
      {selectedProp && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Main Image */}
          <div className="relative bg-gray-200 aspect-video">
            <img
              src={selectedProp.gallery[selectedImage]}
              alt="Gallery"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Image {selectedImage + 1} of {selectedProp.gallery.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="p-6 bg-gray-50">
            <p className="text-gray-600 text-sm mb-4 font-medium">Select an image:</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedProp.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-blue-600 ring-2 ring-blue-400"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">{selectedProp.name}</h2>
            <p className="text-gray-600">Gallery showing {selectedProp.gallery.length} high-quality images</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryTest;
