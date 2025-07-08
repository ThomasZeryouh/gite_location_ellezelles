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

// GET - Récupérer une réservation spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!reservation) {
      return NextResponse.json(
        {
          message: "Réservation non trouvée",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      reservation,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la récupération de la réservation",
        success: false,
      },
      { status: 500 }
    );
  }
}

// PUT - Modifier une réservation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { nom, email, telephone, dateDebut, dateFin, commentaire, statut } =
      await request.json();

    // Vérifier si la réservation existe
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        {
          message: "Réservation non trouvée",
          success: false,
        },
        { status: 404 }
      );
    }

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

    // Vérifier les conflits de dates (en excluant la réservation actuelle)
    const hasConflict = await checkDateConflict(dateDebut, dateFin, params.id);

    if (hasConflict) {
      return NextResponse.json(
        {
          message: "Ces dates sont en conflit avec une réservation existante",
          success: false,
        },
        { status: 409 }
      );
    }

    // Mettre à jour la réservation
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        nom,
        email,
        telephone,
        dateDebut: startDate,
        dateFin: endDate,
        commentaire: commentaire || "",
        statut: statut || "confirmee",
      },
    });

    return NextResponse.json({
      message: "Réservation modifiée avec succès",
      reservation,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la modification de la réservation",
        success: false,
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une réservation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la réservation existe
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!existingReservation) {
      return NextResponse.json(
        {
          message: "Réservation non trouvée",
          success: false,
        },
        { status: 404 }
      );
    }

    // Supprimer la réservation
    await prisma.reservation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Réservation supprimée avec succès",
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la réservation",
        success: false,
      },
      { status: 500 }
    );
  }
}
