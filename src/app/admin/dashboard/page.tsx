"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Users,
  Calendar as CalendarIcon,
  Mail,
  Phone,
} from "lucide-react";
import { format, parseISO, areIntervalsOverlapping, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { SimpleAuth } from "@/lib/simple-auth"; // Ajustez le chemin selon votre structure

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

const AdminDashboard = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    dateDebut: "",
    dateFin: "",
    commentaire: "",
  });

  // Charger les réservations depuis l'API
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations", {
        headers: SimpleAuth.getHeaders(),
      });

      if (response.status === 401) {
        // Token invalide, rediriger vers login
        SimpleAuth.logout();
        router.push("/admin/login");
        return;
      }

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
      } else {
        toast.error("Erreur lors du chargement des réservations");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Vérification de l'authentification et chargement des données
  useEffect(() => {
    // Attendre que le composant soit monté côté client
    if (!SimpleAuth.isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    loadReservations();
  }, [router, loadReservations]);

  const handleLogout = () => {
    SimpleAuth.logout();
    toast.success("Déconnexion réussie");
    router.push("/admin/login");
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      email: "",
      telephone: "",
      dateDebut: "",
      dateFin: "",
      commentaire: "",
    });
    setEditingReservation(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (reservation: Reservation) => {
    setFormData({
      nom: reservation.nom,
      email: reservation.email,
      telephone: reservation.telephone,
      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,
      commentaire: reservation.commentaire,
    });
    setEditingReservation(reservation);
    setIsDialogOpen(true);
  };

  const checkDateConflict = (
    startDate: string,
    endDate: string,
    excludeId?: string
  ) => {
    const newStart = parseISO(startDate);
    const newEnd = parseISO(endDate);

    return reservations.some((reservation) => {
      // Exclure la réservation en cours de modification
      if (excludeId && reservation.id === excludeId) return false;

      const existingStart = parseISO(reservation.dateDebut);
      const existingEnd = parseISO(reservation.dateFin);

      // Logique hôtelière : même jour = OK si c'est départ/arrivée
      if (isSameDay(newStart, existingEnd)) return false;
      if (isSameDay(newEnd, existingStart)) return false;

      return areIntervalsOverlapping(
        { start: newStart, end: newEnd },
        { start: existingStart, end: existingEnd },
        { inclusive: false }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    // Vérifier les conflits côté client (feedback immédiat)
    const hasLocalConflict = checkDateConflict(
      formData.dateDebut,
      formData.dateFin,
      editingReservation?.id
    );

    if (hasLocalConflict) {
      toast.error("Ces dates sont en conflit avec une réservation existante");
      return;
    }

    try {
      let response;

      if (editingReservation) {
        // Modifier une réservation existante
        response = await fetch(`/api/reservations/${editingReservation.id}`, {
          method: "PUT",
          headers: SimpleAuth.getHeaders(),
          body: JSON.stringify(formData),
        });
      } else {
        // Créer une nouvelle réservation
        response = await fetch("/api/reservations", {
          method: "POST",
          headers: SimpleAuth.getHeaders(),
          body: JSON.stringify(formData),
        });
      }

      if (response.status === 401) {
        // Token invalide, rediriger vers login
        SimpleAuth.logout();
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setIsDialogOpen(false);
        resetForm();
        loadReservations(); // Recharger les données
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        headers: SimpleAuth.getHeaders(),
      });

      if (response.status === 401) {
        // Token invalide, rediriger vers login
        SimpleAuth.logout();
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Réservation supprimée");
        loadReservations(); // Recharger les données
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
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

  // Filtrer les réservations pour la date sélectionnée
  const reservationsForSelectedDate = reservations.filter((reservation) => {
    if (!selectedDate) return false;
    const startDate = parseISO(reservation.dateDebut);
    const endDate = parseISO(reservation.dateFin);
    return selectedDate >= startDate && selectedDate <= endDate;
  });

  // Marquer les dates avec réservations sur le calendrier
  const getReservedDates = () => {
    const dates: Date[] = [];
    reservations.forEach((reservation) => {
      const start = parseISO(reservation.dateDebut);
      const end = parseISO(reservation.dateFin);
      const current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Administration - Gîte Ellezelles
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Réservations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reservations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Aujourd&apos;hui
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reservationsForSelectedDate.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions</p>
                <p className="text-lg font-semibold text-gray-900">Gestion</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openCreateDialog}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Réservation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingReservation
                        ? "Modifier la réservation"
                        : "Nouvelle réservation"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nom">Nom complet</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateDebut">Date début</Label>
                        <Input
                          id="dateDebut"
                          name="dateDebut"
                          type="date"
                          value={formData.dateDebut}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateFin">Date fin</Label>
                        <Input
                          id="dateFin"
                          name="dateFin"
                          type="date"
                          value={formData.dateFin}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="commentaire">Commentaire</Label>
                      <Textarea
                        id="commentaire"
                        name="commentaire"
                        value={formData.commentaire}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        {editingReservation ? "Modifier" : "Créer"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendrier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendrier des Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  reserved: getReservedDates(),
                }}
                modifiersStyles={{
                  reserved: {
                    backgroundColor: "#f97316",
                    color: "white",
                    fontWeight: "bold",
                  },
                }}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Jours occupés</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  💡 Astuce : Arrivée/Départ le même jour = autorisé
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des réservations */}
          <Card>
            <CardHeader>
              <CardTitle>
                Réservations{" "}
                {selectedDate &&
                  `pour le ${format(selectedDate, "dd MMMM yyyy", { locale: fr })}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservationsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {reservationsForSelectedDate.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">
                          {reservation.nom}
                        </h3>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(reservation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(reservation.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {reservation.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {reservation.telephone}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {format(
                            parseISO(reservation.dateDebut),
                            "dd/MM/yyyy"
                          )}{" "}
                          -{" "}
                          {format(parseISO(reservation.dateFin), "dd/MM/yyyy")}
                        </div>
                        {reservation.commentaire && (
                          <p className="text-gray-700 mt-2">
                            {reservation.commentaire}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune réservation pour cette date
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Table de toutes les réservations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Toutes les Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.nom}
                    </TableCell>
                    <TableCell>{reservation.email}</TableCell>
                    <TableCell>{reservation.telephone}</TableCell>
                    <TableCell>
                      {format(parseISO(reservation.dateDebut), "dd/MM/yyyy")} -{" "}
                      {format(parseISO(reservation.dateFin), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(reservation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
