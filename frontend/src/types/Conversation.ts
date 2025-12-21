import { Message } from "./Message";
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
  messages?: Message[];
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
