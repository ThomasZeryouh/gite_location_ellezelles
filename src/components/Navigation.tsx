import { Button } from "@/components/ui/button";

import { Calendar, Phone, Menu } from "lucide-react";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const Navigation = () => {
  return (
    <div className="fixed w-full top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <NavigationMenu className="max-w-7xl mx-auto">
        <div className="px-6 py-6">
          <div className="flex justify-between">
            <Link
              href="/"
              className="text-2xl font-serif text-stone-800 hover:text-orange-600 transition-colors px-7"
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
                href="/disponibilite"
                className="text-stone-700 hover:text-orange-600 transition-colors font-medium"
              >
                Disponibilités
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

            <div className="md:hidden flex items-center space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-5">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-6 mt-8">
                    <Link
                      href="/"
                      className="text-stone-700 hover:text-orange-600 transition-colors font-medium text-lg py-2"
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/disponibilite"
                      className="text-stone-700 hover:text-orange-600 transition-colors font-medium text-lg py-2"
                    >
                      Disponibilités
                    </Link>
                    <Link
                      href="/contact"
                      className="text-stone-700 hover:text-orange-600 transition-colors font-medium text-lg py-2"
                    >
                      Contact
                    </Link>
                    <div className="pt-4 border-t border-stone-200">
                      <div className="flex items-center space-x-2 text-stone-600 py-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">+33 3 80 00 00 00</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
};

export default Navigation;
