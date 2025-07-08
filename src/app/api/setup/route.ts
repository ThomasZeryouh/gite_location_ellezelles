import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET et POST font la même chose pour simplifier
async function setupAdmin() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { username: "admin1" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin déjà créé",
        success: true,
      });
    }

    // Créer l'admin avec mot de passe hashé
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.create({
      data: {
        username: "admin1",
        password: hashedPassword,
        email: "admin@gite-ellezelles.be",
        role: "admin",
      },
    });

    // Créer quelques réservations de test
    const reservations = [
      {
        nom: "Jean Dupont",
        email: "jean.dupont@email.com",
        telephone: "+33 6 12 34 56 78",
        dateDebut: new Date("2024-12-20"),
        dateFin: new Date("2024-12-23"),
        commentaire: "Séjour en famille, 2 adultes + 2 enfants",
      },
      {
        nom: "Marie Martin",
        email: "marie.martin@email.com",
        telephone: "+33 6 98 76 54 32",
        dateDebut: new Date("2024-12-23"),
        dateFin: new Date("2025-01-02"),
        commentaire: "Réveillon du Nouvel An",
      },
      {
        nom: "Pierre Lambert",
        email: "pierre.lambert@email.com",
        telephone: "+33 6 55 44 33 22",
        dateDebut: new Date("2025-01-02"),
        dateFin: new Date("2025-01-05"),
        commentaire: "Week-end détente",
      },
    ];

    for (const reservation of reservations) {
      await prisma.reservation.create({
        data: reservation,
      });
    }

    return NextResponse.json({
      message: "Admin et données de test créés avec succès!",
      admin: { username: admin.username, email: admin.email },
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la création",
        error: error,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return setupAdmin();
}

export async function POST() {
  return setupAdmin();
}
