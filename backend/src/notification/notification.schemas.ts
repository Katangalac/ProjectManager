import {z} from 'zod'

/**
 * Schéma de validation pour une notification
 * Vérifie que les données sont présentes et valides
 */
export const notificationSchema = z.object({
    id: z.uuid("ID invalide"),
    userId: z.uuid("ID invalide"),
    message: z.string(),
    read: z.boolean().default(false),     
    updatedAt: z.date(),
    createdAt: z.date()
});

/**
 * Schéma de validation des données pour la création d'une notification
 */
export const createNotificationSchema = notificationSchema.omit({
    id: true,
    read: true,
    updatedAt: true,
    createdAt: true
});

/**
 * Schéma de validation des filtres de recherche des notifications
 * Vérifie que les données sont valides
 */
export const searchNotificationsFilterSchema = z.object({
    read: z
        .string()
        .optional()
        .transform((val) => {
            if (val === undefined) return undefined;
            if (val.toLowerCase() === "true") return true;
            if (val.toLowerCase() === "false") return false;
            throw new z.ZodError([
                {
                    code: 'custom',
                    message: "Invalid boolean value for 'read'",
                    path:["read"]
                }
            ]);
        }),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    all: z
        .string()
        .optional()
        .transform((val) => {
            if (val === undefined) return undefined;
            if (val.toLowerCase() === "true") return true;
            if (val.toLowerCase() === "false") return false;
            throw new z.ZodError([
                {
                    code: 'custom',
                    message: "Invalid boolean value for 'read'",
                    path:["read"]
                }
            ]);
        }),
});