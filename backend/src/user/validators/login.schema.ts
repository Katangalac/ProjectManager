import {z} from 'zod'

//TODO: transferer ce schema dans auth
/**
 * Schéma de validation pour la connexion d'un utilisateur
 * Vérifie qu'un identifiant (le nom d'utilisateur ou l'email) et le mot de passe sont présents et valides
 */
export const loginSchema = z.object({
    identifier: z.string().min(2).max(254),
    password: z.string().min(8, "Le mot de passe doit avoir au moins 8 caractères")
});

/**
 * Type représentant les données attendues lors de la connexion d'un utilisateur
 */
export type LoginInput = z.infer<typeof loginSchema>;