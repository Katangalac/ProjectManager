import { z } from "zod";
import { UserRole, UserProvider } from "@prisma/client";
import { phoneRegex } from "@/utils/utils";

/**
 * Schéma de validation pour un utilisateur
 * Vérifie que les données sont présentes et valides
 */
export const userSchema = z.object({
  id: z.uuid("ID invalide"),
  userName: z
    .string()
    .min(2, "Nom d'utilisateur trop court")
    .max(30, "Nom d'utilisateur trop long"),
  email: z.email().max(254, "Email trop long"),
  password: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères")
    .nullable(),
  firstName: z.string().max(50, "Nom trop long").nullable(),
  lastName: z.string().max(50, "Nom trop long").nullable(),
  phoneNumber: z.string().regex(phoneRegex).nullable(),
  profession: z.string().max(100, "Nom de profession trop long").nullable(),
  imageUrl: z.url().max(2048).nullable(),
  role: z.enum(UserRole),
  provider: z.enum(UserProvider),
  oauthId: z.string().nullable(),
  lastLoginAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schéma de validation des données publiques pour un utilisateur
 * Vérifie que les données sont présentes et valides
 */
export const publicUserSchema = userSchema.omit({
  id: true,
  password: true,
  phoneNumber: true,
  role: true,
  provider: true,
  oauthId: true,
  updatedAt: true,
});

/**
 * Schéma de validation pour l'inscription/création d'un utilisateur
 * Vérifie que le nom d'utilisateur, l'email et le mot de passe sont présents et valides
 */
export const createUserSchema = z.object({
  userName: z
    .string()
    .min(2, "Nom d'utilisateur trop court")
    .max(30, "Nom d'utilisateur trop long"),
  email: z.email().max(254, "Email trop long"),
  password: z
    .string()
    .min(8, "Le mot de passe doit avoir au moins 8 caractères")
    .nullable(),
});

/**
 * Schéma de validation pour la modification des informations d'un utilisateur
 * Vérifie que les données transmises sont valides
 */
export const updateUserDataSchema = z.object({
  userName: z
    .string()
    .min(2, "Nom d'utilisateur trop court")
    .max(30, "Nom d'utilisateur trop long")
    .optional(),
  email: z.email().max(254, "Email trop long").optional(),
  firstName: z.string().max(50, "Nom trop long").nullable().optional(),
  lastName: z.string().max(50, "Nom trop long").nullable().optional(),
  phoneNumber: z.string().regex(phoneRegex).nullable().optional(),
  profession: z
    .string()
    .max(100, "Nom de profession trop long")
    .nullable()
    .optional(),
  imageUrl: z.url().max(2048).nullable().optional(),
});

/**
 * Schéma de validation des filtres de recherche des utilisateurs
 * Vérifie que les données sont valides
 */
export const searchUsersFilterSchema = z.object({
  email: z.string().optional(),
  userName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profession: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  all: z
    .string()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid boolean value for 'read'",
          path: ["read"],
        },
      ]);
    })
    .optional(),
});
