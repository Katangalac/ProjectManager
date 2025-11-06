import { conversationSchema, createConversationSchema } from "../schemas/conversation.schemas";
import { z } from "zod";

/**
 * Type représentant la structure d'un objet Conversation dans la BD
 */
export type Conversation = z.infer<typeof conversationSchema>;

/**
 * Type représentant les données attendues pour la création d'une nouvelle conversation
 */
export type CreateConversationData = z.infer<typeof createConversationSchema>; 