import {z} from 'zod'
import { UserRole } from "@prisma/client";
import { phoneRegex } from '../../utils/utils';


/**
 * Schéma de validation pour un utilisateur
 * Vérifie que les données sont présentes et valides
 */
export const userSchema = z.object({
    id:z.uuid("ID invalide"),
    userName: z.string().min(2, "Nom d'utilisateur trop court").max(30, "Nom d'utilisateur trop long"),
    email: z.email().max(254, "Email trop long"),
    password: z.string().min(8, "Le mot de passe doit avoir au moins 8 caractères"),
    firstName: z.string().max(50, "Nom trop long").nullable(),
    lastName: z.string().max(50, "Nom trop long").nullable(),
    phoneNumber: z.string().regex(phoneRegex).nullable(),
    profession: z.string().max(100, "Nom de profession trop long").nullable(),
    picture: z.instanceof(Uint8Array<ArrayBufferLike>).nullable(),
    imageUrl: z.url().max(2048).nullable(),
    role: z.enum(UserRole),
    createdAt: z.date(),
    updatedAt: z.date()
});

