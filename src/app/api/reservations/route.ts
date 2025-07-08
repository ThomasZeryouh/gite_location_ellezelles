import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { areIntervalsOverlapping, parseISO, isSameDay } from "date-fns";

// Fonction pour vérifier les conflits de dates
async function checkDateConflict(
  startDate: string,
  endDate: string,
  excludeId?: string
) {
  const newStart = parseISO(startDate);
  const newEnd = parseISO(endDate);

  const existingReservations = await prisma.reservation.findMany({
    where: excludeId ? { NOT: { id: excludeId } } : {},
  });

  return existingReservations.some((reservation) => {
    const existingStart = reservation.dateDebut;
    const existingEnd = reservation.dateFin;

    // Logique hôtelière : même jour = OK si c'est départ/arrivée
    if (isSameDay(newStart, existingEnd)) return false;
    if (isSameDay(newEnd, existingStart)) return false;

    return areIntervalsOverlapping(
      { start: newStart, end: newEnd },
      { start: existingStart, end: existingEnd },
      { inclusive: false }
    );
  });
}

// GET - Récupérer toutes les réservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { dateDebut: "asc" },
    });

    return NextResponse.json({
      reservations,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération des réservations",
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle réservation
export async function POST(request: Request) {
  try {
    const { nom, email, telephone, dateDebut, dateFin, commentaire } =
      await request.json();

    // Validation des champs requis
    if (!nom || !email || !telephone || !dateDebut || !dateFin) {
      return NextResponse.json(
        {
          message: "Tous les champs obligatoires doivent être remplis",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validation des dates
    const startDate = parseISO(dateDebut);
    const endDate = parseISO(dateFin);

    if (startDate >= endDate) {
      return NextResponse.json(
        {
          message: "La date de fin doit être après la date de début",
          success: false,
        },
        { status: 400 }
      );
    }

    // Vérifier les conflits de dates
    const hasConflict = await checkDateConflict(dateDebut, dateFin);

    if (hasConflict) {
      return NextResponse.json(
        {
          message: "Ces dates sont en conflit avec une réservation existante",
          success: false,
        },
        { status: 409 }
      );
    }

    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        nom,
        email,
        telephone,
        dateDebut: startDate,
        dateFin: endDate,
        commentaire: commentaire || "",
      },
    });

    return NextResponse.json(
      {
        message: "Réservation créée avec succès",
        reservation,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la création de la réservation",
        success: false,
      },
      { status: 500 }
    );
  }
}
