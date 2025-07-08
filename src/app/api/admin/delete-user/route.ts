import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const username = searchParams.get("username");

    if (!userId && !username) {
      return NextResponse.json(
        {
          message: "ID ou username requis",
          success: false,
        },
        { status: 400 }
      );
    }

    // Supprimer par ID ou username
    const deleteResult = await prisma.user.delete({
      where: userId ? { id: userId } : { username: username! },
    });

    return NextResponse.json({
      message: `Utilisateur ${deleteResult.username} supprimé avec succès`,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la suppression",
        error: error,
        success: false,
      },
      { status: 500 }
    );
  }
}

// Version GET pour utiliser dans le navigateur
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "admin";

    const deleteResult = await prisma.user.delete({
      where: { username },
    });

    return NextResponse.json({
      message: `Utilisateur ${deleteResult.username} supprimé avec succès`,
      success: true,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      {
        message: "Utilisateur non trouvé ou erreur",
        success: false,
      },
      { status: 500 }
    );
  }
}
