import { z } from 'zod'
import { phoneRegex } from '../../utils/utils';

/**
 * Schéma de validation pour la modification des informations d'un utilisateur
 * Vérifie que les données transmises sont valides
 */
export const updateUserSchema = z.object({
    userName: z.string().min(2, "Nom d'utilisateur trop court").max(30, "Nom d'utilisateur trop long").optional(),
    email: z.email().max(254, "Email trop long").optional(),
    firstName: z.string().max(50, "Nom trop long").nullable().optional(),
    lastName: z.string().max(50, "Nom trop long").nullable().optional(),
    phoneNumber: z.string().regex(phoneRegex).nullable().optional(), 
    profession: z.string().max(100, "Nom de profession trop long").nullable().optional(),
    imageUrl: z.url().max(2048).nullable().optional()
});

