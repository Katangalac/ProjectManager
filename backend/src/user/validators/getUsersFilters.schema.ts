import {z} from 'zod'

/**
 * Schéma de validation des filtres de recherche des utilisateurs
 * Vérifie que les données sont valides
 */
export const getUsersFilterSchema = z.object({
    email: z.email().max(254, "Email trop long").optional(),
    userName: z.string().min(2, "Nom d'utilisateur trop court").max(30, "Nom d'utilisateur trop long").optional(),
    firstName: z.string().max(50, "Nom trop long").optional(),
    lastName: z.string().max(50, "Nom trop long").optional(),
    profession: z.string().max(100, "Nom de profession trop long").optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
