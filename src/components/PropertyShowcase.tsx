import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
const PropertyShowcase = () => {
  const images = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
  ];

  const features = [
    "Vue imprenable sur la nature",
    "Cuisine équipée complète",
    "Terrasse privée en bois",
    "Chauffage au bois",
    "Linge écologique fourni",
    "Jardin avec potager",
    "Sentiers de randonnée",
    "Animaux bienvenus",
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-900 mb-6">
            Votre Refuge dans la Nature
          </h2>
          <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
            Un espace authentique conçu pour vous offrir une expérience unique
            en harmonie avec environnement naturel environnant.
          </p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Image
                src={image}
                alt={`Vue ${index + 1} du logement`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Property Details */}
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="p-8 shadow-lg border-green-200 bg-green-50">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-green-900 mb-8">
                Caractéristiques du Refuge
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">Surface :</span>
                  <span className="font-semibold text-green-900">85 m²</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">Chambres :</span>
                  <span className="font-semibold text-green-900">2</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">
                    Salle de bain :
                  </span>
                  <span className="font-semibold text-green-900">1</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">Capacité :</span>
                  <span className="font-semibold text-green-900">
                    4 personnes
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-green-700 font-medium">
                    Tarif par nuit :
                  </span>
                  <span className="font-bold text-green-600 text-2xl">89€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-8 shadow-lg border-green-200 bg-amber-50">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-green-900 mb-8">
                Expérience Naturelle
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-green-800 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PropertyShowcase;
