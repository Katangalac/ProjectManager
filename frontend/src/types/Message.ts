import { Pagination } from "./Pagination";
import { User } from "./User";
/**
 * Type représentant un message
 */
export type Message = {
  id: string;
  senderId: string | null;
  conversationId: string;
  content: string | null;
  read: boolean;
  updatedAt: Date;
  createdAt: Date;
};

export type MessageWithRelation = Message & {
  sender?: User;
  attachments?: Attachment[];
};

/**
 * Type représentant la structure des responses API pour une requte de recupération des messages
 */
export type MessagesApiResponse = {
  data: MessageWithRelation[];
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type représentant la structure des responses API pour une requte de recupération d'un message
 */
export type MessageApiResponse = {
  data: MessageWithRelation;
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type représentant un élément joint/attaché à un message
 */
export type Attachment = {
  url: string;
  type: string;
};

/**
 * Type des données attendues lors de la création d'un message
 */
export type CreateMessageData = {
  senderId: string;
  conversationId: string;
  content: string;
  attachments?: Attachment[] | undefined;
};

/**
 * Type des données attendues lors de la modification d'un message
 */
export type EditMessageData = {
  userId: string;
  newContent: string;
};

/**
 * Type des données attendues comme paramètre de recherche des messages
 */
export type SearchMessagesFilter = {
  read?: boolean | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  all?: boolean | undefined;
};
