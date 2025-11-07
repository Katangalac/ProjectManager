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
