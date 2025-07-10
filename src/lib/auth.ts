import { useState, useEffect } from "react";
// Utilitaires pour l'authentification côté client

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export class AuthService {
  private static TOKEN_KEY = "adminToken";
  private static USER_KEY = "adminUser";

  // Obtenir le token stocké
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtenir l'utilisateur stocké
  static getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Sauvegarder le token et l'utilisateur
  static setAuth(token: string, user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Supprimer l'authentification
  static clearAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtenir les headers d'authentification pour les API calls
  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Hook pour utiliser dans les composants React
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthService.getUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    AuthService.setAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    AuthService.clearAuth();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: AuthService.isAuthenticated(),
    login,
    logout,
  };
}
