"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyCarousel = () => {
  const images = [
    { src: "/10.jpeg", alt: "Vue extérieure de la demeure" },
    { src: "/11.jpeg", alt: "Salon principal" },
    { src: "/12.jpeg", alt: "Chambre principale" },
    { src: "/salon.jpeg", alt: "Cuisine traditionnelle" },
    { src: "/chambre.webp", alt: "Jardins et parc" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Image principale */}
      <div className="relative w-full overflow-hidden rounded-lg shadow-2xl">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          width={1200}
          height={600}
          className="w-full h-[500px] md:h-[600px] object-cover transition-all duration-500"
          priority
        />

        {/* Boutons de navigation */}
        <Button
          onClick={prevImage}
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          onClick={nextImage}
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-orange-600"
                : "bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-3 mt-6">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`relative overflow-hidden rounded-md transition-all duration-300 ${
              index === currentIndex
                ? "ring-2 ring-orange-600 opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={200}
              height={80}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyCarousel;
