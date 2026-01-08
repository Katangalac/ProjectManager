import { MessageWithRelation } from "./Message";
import { Pagination } from "./Pagination";
import { User } from "./User";

/**
 * Type représentant une conversation
 */
export type Conversation = {
  id: string;
  isGroup: boolean;
  teamId: string | null;
  updatedAt: Date;
  createdAt: Date;
};

export type ConversationWithRelation = Conversation & {
  participants?: { user: User }[];
  messages?: MessageWithRelation[];
};

/**
 * Type représentant la structure des responses API pour une requte de recupération des conversations
 */
export type ConversationsApiResponse = {
  data: ConversationWithRelation[];
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type des données attendues lors de la création d'une conversation
 */
export type CreateConversationData = {
  isGroup: boolean;
  teamId: string | null;
  participantIds: string[];
};

/**
 * Type des données attendues comme paramètre de recherche des conversations
 */
export type SearchConversationsFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  teamId?: string | undefined;
  isGroup?: boolean | undefined;
  all?: boolean | undefined;
};
