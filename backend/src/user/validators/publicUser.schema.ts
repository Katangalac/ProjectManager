import {z} from 'zod'

/**
 * Schéma de validation des données publiques pour un utilisateur
 * Vérifie que les données sont présentes et valides
 */
export const publicUserSchema = z.object({
    userName: z.string().min(2, "Nom d'utilisateur trop court").max(30, "Nom d'utilisateur trop long"),
    email: z.email().max(254, "Email trop long").nullable(),
    firstName: z.string().max(50, "Nom trop long").nullable(),
    lastName: z.string().max(50, "Nom trop long").nullable(),
    profession: z.string().max(100, "Nom de profession trop long").nullable(),
    picture: z.instanceof(Uint8Array).nullable(),
    imageUrl: z.url().max(2048).nullable(),
    createdAt: z.date().nullable(),
});

