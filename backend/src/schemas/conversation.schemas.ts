import { z } from "zod";

/**
 * Schéma des validations de la structure d'un objet de type Conversation
 */
export const conversationSchema = z.object({
    id: z.uuid("ID invalide"),
    isGroup: z.boolean().default(false),
    teamId: z.uuid().nullable(),       
    updatedAt: z.date(),  
    createdAt: z.date()    
});

/**
 * Schéma des validations des informations attendues pour la création d'une conversation
 */
export const createConversationSchema = z.object({
    isGroup: z.boolean().default(false),
    teamId: z.uuid("ID invalide").nullable(),
    participantIds: z.array(z.uuid("ID invalide"))
}).refine(
    (data) => {
      if (data.teamId) return data.isGroup === true;
      return true;
    },
    { message: "Si une équipe est associée, la conversation doit être un groupe", path: ["isGroup"] }
  )
  .refine(
    (data) => {
      if (!data.isGroup && data.participantIds.length > 2) return false;
      return true;
    },
    { message: "Une conversation privée doit max 2 participants", path: ["participantIds"] }
  );

  /**
   * Schéma de validation des filtres de recherche des conversations
   * Vérifie que les données sont valides
   */
export const searchConversationsFilterSchema = z.object({
    teamId: z.uuid("ID invalide").optional(),
    isGroup: z
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
  
