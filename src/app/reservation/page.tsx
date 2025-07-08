"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Contact } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Reservation = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    specialRequests: "",
  });

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = 96;
    const Pricehousehold = 40;
    return nights * pricePerNight + Pricehousehold;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!checkIn || !checkOut) {
      toast.error("Veuillez sélectionner les dates d'arrivée et de départ.");
      setIsSubmitting(false);
      return;
    }

    const reservationData = {
      ...formData,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights: calculateNights(),
      total: calculateTotal(),
    };

    try {
      const response = await fetch("/api/reservations/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          guests: "",
          specialRequests: "",
        });
        setCheckIn(undefined);
        setCheckOut(undefined);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navigation />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demande de réservation en ligne
            </h1>
            <p className="text-lg text-gray-600">
              Votre séjour en quelques clics. Confirmation rapide garantie !
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <Card className="md:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <CalendarIcon className="mr-3 h-6 w-6 text-blue-600" />
                  Détails de la demande de Réservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date d&apos;arrivée *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !checkIn && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn
                              ? format(checkIn, "PPP", { locale: fr })
                              : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Date de départ *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !checkOut && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut
                              ? format(checkOut, "PPP", { locale: fr })
                              : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              if (date < today) return true;

                              if (checkIn) {
                                const checkInDate = new Date(checkIn);
                                checkInDate.setHours(0, 0, 0, 0);
                                return date <= checkInDate;
                              }

                              return false;
                            }}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests">Nombre de personnes *</Label>
                      <Select
                        name="guests"
                        value={formData.guests}
                        disabled={isSubmitting}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, guests: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 personne</SelectItem>
                          <SelectItem value="2">2 personnes</SelectItem>
                          <SelectItem value="3">3 personnes</SelectItem>
                          <SelectItem value="4">4 personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="mt-1"
                        placeholder="Votre téléphone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">Demandes spéciales</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-1 h-24"
                      placeholder="Lit bébé, accès mobilité réduite, allergies alimentaires..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Contact className="mr-2 h-5 w-5" />
                    {isSubmitting
                      ? "Envoi en cours..."
                      : "Demander la Réservation"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card className="shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src="/12.jpeg"
                      alt="Logement"
                      width={400}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Location Gîte de campagne
                  </h3>
                  <p className="text-sm text-gray-600">
                    Appartement 2 chambres • 4 personnes
                  </p>
                </div>

                {checkIn && checkOut && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Arrivée :</span>
                      <span className="font-medium">
                        {format(checkIn, "dd/MM/yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Départ :</span>
                      <span className="font-medium">
                        {format(checkOut, "dd/MM/yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nombre de nuits :</span>
                      <span className="font-medium">{calculateNights()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de ménage </span>
                      <span className="font-medium">40€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        96€ × {calculateNights()} nuits + ménage:
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total :</span>
                      <span className="text-blue-600">{calculateTotal()}€</span>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    ✓ Inclus
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Wifi gratuit</li>
                    <li>• Parking inclus</li>
                    <li>• Linge de maison</li>
                    <li>• Ménage final</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    ℹ️ À savoir
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Arrivée : 15h00 - 20h00</li>
                    <li>• Départ : 08h00 - 11h00</li>
                    <li>• Caution : 200€</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
