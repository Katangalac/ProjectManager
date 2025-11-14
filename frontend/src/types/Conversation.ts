import type { Pagination } from "./Pagination";

export type Conversation = {
    id: string;
    isGroup: boolean;
    teamId: string | null;
    updatedAt: Date;
    createdAt: Date;
};

export type CreateConversationData = {
    isGroup: boolean;
    teamId: string | null;
    participantIds: string[];
};

export type SearchConversationsFilter = {
    page: number;
    pageSize: number;
    teamId?: string | undefined;
    isGroup?: boolean | undefined;
    all?: boolean | undefined;
};

export type ConversationsCollection = {
    conversations: Conversation[],
    pagination: Pagination
};