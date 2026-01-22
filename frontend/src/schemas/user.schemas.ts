import { z } from "zod";
//Format des numéros de téléphone
export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Schéma de validation pour la modification des informations d'un utilisateur
 * Vérifie que les données transmises sont valides
 */
export const updateUserDataSchema = z.object({
  userName: z
    .string()
    .min(2, "UserName is too short (min 2)")
    .max(30, "UserName is too long (max 30)")
    .optional(),
  email: z.email().max(254, "Email is too long").optional(),
  firstName: z
    .string()
    .max(50, "Name is too long (max 50)")
    .nullable()
    .optional(),
  lastName: z
    .string()
    .max(50, "Name is too long (max 50)")
    .nullable()
    .optional(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid phone number")
    .nullable()
    .optional(),
  profession: z
    .string()
    .max(100, "Profession is too long (max 50)")
    .nullable()
    .optional(),
  imageUrl: z.url().max(2048).nullable().optional(),
});

/**
 * Schéma de validation des filtres de recherche des utilisateurs
 * Vérifie que les données sont valides
 */
export const searchUsersFilterSchema = z.object({
  email: z.email().max(254, "Email is too long").optional(),
  userName: z.string().optional(),
  firstName: z.string().max(50, "Name is too long").optional(),
  lastName: z.string().max(50, "Name is too long").optional(),
  profession: z.string().max(100, "Profession is too long").optional(),
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
