import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          message: "Username et password requis",
          success: false,
        },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Identifiants incorrects",
          success: false,
        },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          message: "Identifiants incorrects",
          success: false,
        },
        { status: 401 }
      );
    }

    // Créer le JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        message: "Erreur serveur",
        success: false,
      },
      { status: 500 }
    );
  }
}
