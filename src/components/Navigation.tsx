import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-serif text-stone-800 hover:text-orange-600 transition-colors"
          >
            Les Belles Collines
          </Link>

          <div className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-stone-700 hover:text-orange-600 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/contact"
              className="text-stone-700 hover:text-orange-600 transition-colors font-medium"
            >
              Contact
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-stone-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+33 3 80 00 00 00</span>
              </div>
              <Link href="/reservation">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 shadow-md hover:shadow-lg px-6">
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <Link href="/reservation">
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-md"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
