import { z } from "zod";

/**
 * Schéma des validations de la structure d'un objet de type Message
 */
export const messageSchema = z.object({
    id: z.uuid("ID invalide"),
    senderId: z.uuid("ID invalide").nullable(),     
    conversationId: z.uuid("ID invalide"),
    content: z.string().nullable(),     
    read: z.boolean().default(false),        
    updatedAt: z.date(),  
    createdAt: z.date()
});

/**
 * TODO
 */
export const attachmentSchema = z.object({
  url: z.url(), 
  type: z.string(), 
});

/**
 * Schéma des validations des informations attendues pour la création d'un message
 */
export const createMessageSchema = z.object({
    senderId: z.uuid("ID invalide"),
    conversationId: z.uuid("ID invalide"),
    content: z.string(),
    attachments: z.array(attachmentSchema).optional()
});

/**
 * Schéma des validations des informations attendues pour la modification d'un message
 */
export const editMessageSchema = z.object({
    userId: z.uuid("ID invalide"),
    newContent: z.string()
});

/**
 * Schéma de validation des filtres de recherche des messages
 * Vérifie que les données sont valides
 */
export const searchMessagesFilterSchema = z.object({
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
        }).optional(),
});
