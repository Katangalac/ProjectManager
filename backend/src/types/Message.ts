import {
  messageSchema,
  createMessageSchema,
  editMessageSchema,
  searchMessagesFilterSchema,
} from "@/schemas/message.schemas";
import { z } from "zod";
import { Pagination } from "@/types/Pagination";

/**
 * Type représentant la structure d'un objet Message dans la BD
 */
export type Message = z.infer<typeof messageSchema>;

/**
 * Type représentant la structure d'un objet Message dans la BD
 */
export type CreateMessageData = z.infer<typeof createMessageSchema>;

/**
 * Type représentant les données attendues lors de la modification d'un message
 */
export type EditMessageData = z.infer<typeof editMessageSchema>;

/**
 * Type représentant les données attendues comme filtre de recherche des messages
 */
export type SearchMessagesFilter = z.infer<typeof searchMessagesFilterSchema>;

/**
 * Type représentant une liste des messages ainsi que les informations sur la pagination
 */
export type MessagesCollection = {
  messages: Message[];
  pagination: Pagination;
};
