import type { Pagination } from "./Pagination";

export type Notification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    updatedAt: Date;
    createdAt: Date;
};

export type CreateNotificationData = {
    message: string;
    userId: string;
    title: string;
};

export type SearchNotificationsFilter = {
    page: number;
    pageSize: number;
    read?: boolean | undefined;
    all?: boolean | undefined;
};

export type NotificationsCollection = {
    notifications: Notification[],
    pagination: Pagination
};