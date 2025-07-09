import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  Car,
  Utensils,
  TreePine,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import PropertyCarousel from "@/components/PropertyCarousel";
import ContactForm from "@/components/ContactForm";
import HeroImage from "../../public/11.jpeg";

const Index = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={HeroImage}
            alt="Les Belles Collines - Demeure bourguignonne"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-lg font-light tracking-wider text-orange-200 mb-4">
              COLLECTION CAMPAGNE
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 leading-tight tracking-wide">
              Les Belles Collines
              <span className="block text-orange-300 font-normal">
                Ellezelles, Belgique
              </span>
            </h1>
            <div className="w-24 h-0.5 bg-orange-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-light text-stone-200 max-w-3xl mx-auto leading-relaxed">
              Une demeure d&apos;exception au cœur de la campagne
            </p>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-orange-600 text-sm font-medium tracking-wider uppercase mb-4">
              Savoir-Faire
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8 font-light">
              L&apos;Art de l&apos;Hospitalité Rurale
            </h2>
            <div className="w-16 h-0.5 bg-orange-500 mx-auto"></div>
          </div>

          {/* Image Gallery */}
          <PropertyCarousel />

          {/* Property Information */}
          <div className="grid lg:grid-cols-2 gap-16 mt-20">
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-serif text-stone-800 mb-6">
                  Description
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg mb-6">
                  Bienvenue à Ellezelles ! Dans ce logement spacieux et
                  lumineux, pouvant accueillir jusqu&apos;à 4 personnes. Parfait
                  pour profiter du calme et d&apos;une magnifique vue dégagée
                  sur la campagne. Avec une chambre confortable et un canapé-lit
                  dans le salon, cuisine équipée, salle de bain moderne et des
                  toilettes séparées.
                </p>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Idéal pour les amateurs de vélo : situé au cœur du Pays des
                  Collines, paradis des cyclistes et des randonneurs. Calme
                  garanti pour un séjour ressourçant.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-stone-800 mb-8">
                  Le Logement
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Appartement Privé
                      </h4>
                      <p className="text-stone-600">
                        Entrée et terrasse privée sur la propriété à côté des
                        propriétaires
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Cuisine Équipée
                      </h4>
                      <p className="text-stone-600">
                        Kitchenette avec plaque à induction, four, grand
                        réfrigérateur-congélateur SMEG, micro-ondes, cafetière
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Espace de Vie
                      </h4>
                      <p className="text-stone-600">
                        Coin salon avec 2 canapés doubles (1 canapé-lit), table
                        basse, bibliothèque et smart télévision
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Chambre & Salle de Bain
                      </h4>
                      <p className="text-stone-600">
                        Chambre avec lit double ou 2 lits séparés, salle de bain
                        avec douche italienne, toilettes séparées
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Terrasse Privée
                      </h4>
                      <p className="text-stone-600">
                        Lounge, table et 4 chaises, barbecue pour profiter de
                        l&apos;extérieur
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-stone-800 mb-8">
                  Fournis
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Équipements de Cuisine
                      </h4>
                      <p className="text-stone-600">
                        Couverts, assiettes, verres, tasses, casseroles et
                        poêles
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Linge & Confort
                      </h4>
                      <p className="text-stone-600">
                        Literie complète, serviettes de toilette et de cuisine
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-stone-800 mb-2">
                        Produits de Base
                      </h4>
                      <p className="text-stone-600">
                        Éponge, savon vaisselle, poivre, sel, huile d&apos;olive
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-10 shadow-xl border-stone-200 bg-gradient-to-br from-stone-50 to-orange-50">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <p className="text-orange-600 text-sm font-medium tracking-wider uppercase mb-2">
                    Tarification
                  </p>
                  <div className="text-4xl font-serif text-stone-800 mb-2">
                    96€
                  </div>
                  <p className="text-stone-600">par nuit</p>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="font-medium text-stone-800">
                        1 Chambres ,
                      </div>
                      <div className="text-sm text-stone-600">4 personnes</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TreePine className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="font-medium text-stone-800">
                        Randonné et Balade
                      </div>
                      <div className="text-sm text-stone-600">
                        Le Pays des Collines
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Car className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="font-medium text-stone-800">Parking</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Utensils className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="font-medium text-stone-800">Cuisine</div>
                    </div>
                  </div>
                </div>

                <Link href="/reservation">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Calendar className="mr-3 h-5 w-5" />
                    Demande de réservation
                  </Button>
                </Link>
              </CardContent>
              <Card className="my-32">
                <CardContent className="py-8 ">
                  <CardHeader>
                    <CardTitle className="items-center">
                      <h1>Galerie d&apos;images</h1>
                    </CardTitle>
                  </CardHeader>
                  <Carousel>
                    <CarouselContent>
                      <CarouselItem>
                        <Image
                          src="/cuisine.jpeg"
                          alt="cuisine"
                          height={500}
                          width={500}
                        />
                      </CarouselItem>
                      <CarouselItem>...</CarouselItem>
                      <CarouselItem>...</CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-600 text-sm font-medium tracking-wider uppercase mb-4">
              Contact
            </p>
            <h2 className="text-4xl font-serif text-stone-800 mb-8 font-light">
              Demande de Renseignements
            </h2>
            <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Notre équipe de conseillers est à votre disposition pour
              personnaliser votre séjour d&apos;exception
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-serif text-white mb-6">
                Les Belles Collines
              </h3>
              <p className="text-stone-400 leading-relaxed">
                Collection privée de demeures d&apos;exception en Bourgogne, où
                l&apos;art de vivre français rencontre l&apos;authenticité du
                terroir.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-6">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-orange-400" />
                  <span>+33 3 80 00 00 00</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <span>contact@bellescollines.fr</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span>Bourgogne, France</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-6">Informations</h4>
              <div className="space-y-3 text-stone-400">
                <p>Mentions légales</p>
                <p>Conditions générales</p>
                <p>Politique de confidentialité</p>
                <Link
                  href="/admin/login"
                  className="block text-stone-600 hover:text-stone-400 transition-colors text-xs opacity-50 hover:opacity-100"
                >
                  •
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-8 text-center">
            <p className="text-stone-500">
              © 2024 Les Belles Collines. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
