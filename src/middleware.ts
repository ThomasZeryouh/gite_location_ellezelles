import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Protéger les pages admin (sauf login)
  const isAdminPage =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // Protéger les API reservations pour POST, PUT, DELETE (pas GET)
  const isProtectedAPI =
    pathname.startsWith("/api/reservations") &&
    ["POST", "PUT", "DELETE"].includes(method);

  console.log("🔐 Middleware - Route:", pathname, "Method:", method);
  console.log("🔐 Admin page:", isAdminPage, "Protected API:", isProtectedAPI);

  if (isAdminPage || isProtectedAPI) {
    // Chercher le token dans le cookie ou header
    const cookieToken = request.cookies.get("adminToken")?.value;
    const headerToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    const token = cookieToken || headerToken;

    console.log("🔐 Middleware - Cookie:", cookieToken ? "présent" : "absent");
    console.log("🔐 Middleware - Header:", headerToken ? "présent" : "absent");
    console.log("🔐 Middleware - Token final:", token ? "présent" : "absent");

    // Pas de token
    if (!token) {
      console.log("❌ Middleware - Pas de token");
      if (isAdminPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if (isProtectedAPI) {
        return NextResponse.json(
          { message: "Authentification requise", success: false },
          { status: 401 }
        );
      }
    }

    // Vérifier si le token est valide avec jose (compatible Edge Runtime)
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback-secret"
      );
      await jwtVerify(token!, secret);
      console.log("✅ Middleware - Token valide");
    } catch (error) {
      console.log("❌ Middleware - Token invalide:", error);
      if (isAdminPage) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if (isProtectedAPI) {
        return NextResponse.json(
          { message: "Token invalide", success: false },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/reservations/:path*"],
};
