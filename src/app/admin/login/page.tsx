"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
import { SimpleAuth } from "@/lib/simple-auth";

const AdminLogin = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🔄 Tentative de connexion...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("📡 Réponse API:", response.status);
      const data = await response.json();
      console.log("📋 Data reçue:", data);

      if (data.success) {
        console.log(
          "✅ Login réussi, token:",
          data.token ? "présent" : "manquant"
        );

        // Sauvegarder le token avec SimpleAuth
        SimpleAuth.setToken(data.token);

        // Vérifier que le token est bien sauvegardé
        console.log(
          "💾 Token sauvegardé:",
          SimpleAuth.getToken() ? "✅" : "❌"
        );
        console.log("🍪 Cookies après sauvegarde:", document.cookie);

        toast.success("Connexion réussie !");

        // Attendre un peu avant la redirection
        setTimeout(() => {
          console.log("🔄 Redirection vers /admin/dashboard");
          router.push("/admin/dashboard");
        }, 100);
      } else {
        console.log("❌ Login échoué:", data.message);
        toast.error(data.message || "Identifiants incorrects");
      }
    } catch (error) {
      console.error("💥 Erreur de connexion:", error);
      toast.error("Erreur de connexion au serveur");
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Administration
          </CardTitle>
          <p className="text-gray-600">
            Connectez-vous pour gérer les réservations
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="Entrez votre nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="Entrez votre mot de passe"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-medium transition-all duration-300"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Identifiants de test :
            </p>
            <p className="text-xs text-blue-600">
              Utilisateur : <span className="font-mono">admin</span>
              <br />
              Mot de passe : <span className="font-mono">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
