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
      if (!data.isGroup && data.participantIds.length !== 2) return false;
      return true;
    },
    { message: "Une conversation privée doit avoir exactement 2 participants", path: ["participantIds"] }
  );

