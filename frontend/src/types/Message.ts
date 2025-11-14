import type { Pagination } from "./Pagination";

export type Message = {
    id: string;
    senderId: string | null;
    conversationId: string;
    content: string | null;
    read: boolean;
    updatedAt: Date;
    createdAt: Date;
};

export type Attachment = {
    url: string;
    type: string;
};

export type CreateMessageData = {
    senderId: string;
    conversationId: string;
    content: string;
    attachments?: Attachment[] | undefined;
};

export type EditMessageData = {
    userId: string;
    newContent: string;
};

export type SearchMessagesFilter = {
    read: boolean | undefined;
    page: number;
    pageSize: number;
    all?: boolean | undefined;
};

export type MessagesCollection = {
    messages: Message[],
    pagination: Pagination
};