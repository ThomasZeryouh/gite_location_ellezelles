import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer l'utilisateur admin par défaut
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin1",
      password: hashedPassword,
      email: "admin@gite-ellezelles.be",
      role: "admin",
    },
  });

  // Créer quelques réservations de démonstration
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
    await prisma.reservation.upsert({
      where: {
        // Utiliser une combinaison unique pour éviter les doublons
        id: `${reservation.nom
          .replace(/\s+/g, "")
          .toLowerCase()}-${reservation.dateDebut.getTime()}`,
      },
      update: {},
      create: {
        ...reservation,
        id: `${reservation.nom
          .replace(/\s+/g, "")
          .toLowerCase()}-${reservation.dateDebut.getTime()}`,
      },
    });
  }

  console.log("🌱 Base de données initialisée avec succès!");
  console.log("👤 Utilisateur admin créé:", admin.username);
  console.log("📅 Réservations de démonstration créées");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
