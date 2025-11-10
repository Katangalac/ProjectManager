import { conversationSchema, createConversationSchema, searchConversationsFilterSchema } from "./conversation.schemas";
import { z } from "zod";

/**
 * Type représentant la structure d'un objet Conversation dans la BD
 */
export type Conversation = z.infer<typeof conversationSchema>;

/**
 * Type représentant les données attendues pour la création d'une nouvelle conversation
 */
export type CreateConversationData = z.infer<typeof createConversationSchema>; 

/**
 * Type représentant les données attendues comme filtre de recherche des conversations
 */
export type SearchConversationsFilter = z.infer<typeof searchConversationsFilterSchema>;