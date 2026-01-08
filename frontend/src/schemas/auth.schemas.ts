import { z } from "zod";

/**
 * Schéma de validation pour la connexion d'un utilisateur
 * Vérifie qu'un identifiant (le nom d'utilisateur ou l'email) et le mot de passe sont présents et valides
 */
export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifiant requis"),
  password: z.string().min(8, "Mot de passe trop court (min 8)"),
});

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 */
export const registerSchema = z.object({
  userName: z.string().min(3, "Nom d'utilisateur trop court"),
  email: z.email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court (min 8)"),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password should have at least 8 characters"),
});
