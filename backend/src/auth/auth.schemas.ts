import { z } from "zod";
import { UserRole, UserProvider } from "@prisma/client";

/**
 * Schéma de validation pour la connexion d'un utilisateur
 * Vérifie qu'un identifiant (le nom d'utilisateur ou l'email) et le mot de passe sont présents et valides
 */
export const loginDataSchema = z.object({
  identifier: z.string().min(2).max(254),
  password: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
});

/**
 * Schéma de validation pour le payload du token d'authentification
 */
export const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email().max(254, "Email trop long"),
  role: z.enum(UserRole),
  provider: z.enum(UserProvider),
});

/**
 * Schéma de validation pour le payload du token de  reset de mot de passe
 */
export const resetPasswordTokenPayloadSchema = z.object({
  userId: z.uuid(),
  action: z.enum(["reset_password"]),
});

/**
 * Schéma de validation de données d'entrée pour la modification du mot de passe
 */
export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
});

/**
 * Schéma de validation de données d'entrée pour le reset du mot de passe
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères"),
});
