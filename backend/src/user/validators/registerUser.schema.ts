import {z} from 'zod'

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 * Vérifie que le nom d'utilisateur, l'email et le mot de passe sont présents et valides
 */
export const registerUserSchema = z.object({
    userName: z.string().min(2, "Nom d'utilisateur trop court").max(30, "Nom d'utilisateur trop long"),
    email: z.email().max(254, "Email trop long"),
    password: z.string().min(8, "Le mot de passe doit avoir au moins 8 caractères"),
    firstName: z.string().max(50, "Nom trop long").nullable(),
    lastName: z.string().max(50, "Nom trop long").nullable(),
    profession: z.string().max(100, "Nom de profession trop long").nullable()
});

