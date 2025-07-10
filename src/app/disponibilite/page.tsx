"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import {
  format,
  parseISO,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { toast } from "sonner";

// Type pour les réservations depuis l'API
interface ApiReservation {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  commentaire: string;
  statut?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type pour les réservations dans le state
interface Reservation {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  dateDebut: string;
  dateFin: string;
  commentaire: string;
  statut?: string;
}

const Disponibilite = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reservedDates, setReservedDates] = useState<Date[]>([]);

  // Charger les réservations depuis l'API
  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations");
      const data = await response.json();

      if (data.success) {
        // Convertir les dates au format string pour compatibilité
        const formattedReservations: Reservation[] = data.reservations.map(
          (res: ApiReservation) => ({
            id: res.id,
            nom: res.nom,
            email: res.email,
            telephone: res.telephone,
            dateDebut: format(new Date(res.dateDebut), "yyyy-MM-dd"),
            dateFin: format(new Date(res.dateFin), "yyyy-MM-dd"),
            commentaire: res.commentaire,
            statut: res.statut,
          })
        );
        setReservations(formattedReservations);

        // Calculer toutes les dates réservées
        const allReservedDates: Date[] = [];
        formattedReservations.forEach((reservation: Reservation) => {
          const startDate = parseISO(reservation.dateDebut);
          const endDate = parseISO(reservation.dateFin);

          const datesInRange = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          allReservedDates.push(...datesInRange);
        });

        setReservedDates(allReservedDates);
      } else {
        toast.error("Erreur lors du chargement des disponibilités");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // Filtrer les réservations pour la date sélectionnée
  const reservationsForSelectedDate = reservations.filter((reservation) => {
    if (!selectedDate) return false;
    const startDate = parseISO(reservation.dateDebut);
    const endDate = parseISO(reservation.dateFin);
    return selectedDate >= startDate && selectedDate <= endDate;
  });

  // Navigation entre les mois
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du calendrier...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📅 Disponibilité du Gîte
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Consultez en temps réel les créneaux disponibles pour votre séjour
            </p>

            {/* Boutons d'action */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={goToToday}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Aujourd&apos;hui
              </Button>

              <Button
                onClick={loadReservations}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>

              <Link href="/reservation">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Faire une réservation
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Calendrier principal */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-900">
                      {format(currentDate, "MMMM yyyy", { locale: fr })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={goToPreviousMonth}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={goToNextMonth}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentDate}
                    numberOfMonths={2}
                    onMonthChange={setCurrentDate}
                    locale={fr}
                    className="w-full"
                    classNames={{
                      months:
                        "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                      month: "space-y-4 w-full flex flex-col",
                      table: "w-full h-full border-collapse space-y-1",
                      head_row: "",
                      head_cell:
                        "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] h-14 flex items-center justify-center",
                      row: "flex w-full mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 h-14 flex-1 flex items-center justify-center",
                      day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      day_today:
                        "bg-blue-600 text-white font-semibold hover:bg-blue-700",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_outside: "text-muted-foreground opacity-50",
                    }}
                    modifiers={{
                      reserved: reservedDates,
                      today: new Date(),
                    }}
                    modifiersStyles={{
                      reserved: {
                        backgroundColor: "rgba(248, 113, 113, 0.3)", // Rouge très léger
                        color: "#dc2626", // Texte rouge foncé
                        fontWeight: "600",
                        border: "2px solid #fca5a5", // Bordure rouge claire
                        borderRadius: "6px",
                      },
                      today: {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "6px",
                      },
                    }}
                    modifiersClassNames={{
                      reserved: "hover:bg-red-200 focus:bg-red-200",
                      today: "hover:bg-blue-700 focus:bg-blue-700",
                    }}
                  />

                  {/* Légende */}
                  <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                      <span>Réservé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span>Aujourd&apos;hui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel d'informations */}
            <div className="lg:col-span-1 space-y-6">
              {/* Statistiques */}

              {/* Détails de la date sélectionnée */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      📅 {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reservationsForSelectedDate.length > 0 ? (
                      <div className="space-y-4">
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="text-red-800 font-medium">
                            ❌ Date non disponible
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-green-800 font-medium">
                            ✅ Date disponible
                          </p>
                        </div>
                        <Link href="/reservation">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Réserver cette date
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Informations pratiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ℹ️ Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">🏠 Capacité :</p>
                    <p className="text-gray-600">4 personnes maximum</p>
                  </div>
                  <div>
                    <p className="font-medium">💰 Tarifs :</p>
                    <p className="text-gray-600">96€/nuit + 40€ ménage</p>
                  </div>
                  <div>
                    <p className="font-medium">🕐 Horaires :</p>
                    <p className="text-gray-600">Arrivée : 15h-20h</p>
                    <p className="text-gray-600">Départ : 8h-11h</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disponibilite;
