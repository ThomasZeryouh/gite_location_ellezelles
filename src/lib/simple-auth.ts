// lib/simple-auth.ts
export class SimpleAuth {
  // Vérifier si on est côté client
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  // Sauvegarder le token (localStorage + cookie pour middleware)
  static setToken(token: string) {
    if (!this.isClient()) return;

    localStorage.setItem("adminToken", token);
    // Cookie pour le middleware
    document.cookie = `adminToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
  }

  // Récupérer le token
  static getToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem("adminToken");
  }

  // Vérifier si connecté
  static isAuthenticated(): boolean {
    if (!this.isClient()) return false;
    return !!this.getToken();
  }

  // Se déconnecter
  static logout() {
    if (!this.isClient()) return;

    localStorage.removeItem("adminToken");
    // Supprimer le cookie
    document.cookie =
      "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }

  // Headers pour les API calls
  static getHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}
