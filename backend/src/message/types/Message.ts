import { messageSchema, createMessageSchema, editMessageSchema } from "../schemas/message.schemas";
import { z } from "zod";
import { editMessage } from "../services/message.services";

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