import { Pagination } from "./Pagination";

/**
 * Type représentant une notification
 */
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  updatedAt: Date;
  createdAt: Date;
};

/**
 * Type représentant la structure des responses API pour une requte de recupération des notifications
 */
export type NotificationsApiResponse = {
  data: Notification[];
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type des données attendues lors de la création d'une notification
 */
export type CreateNotificationData = {
  message: string;
  userId: string;
  title: string;
};

/**
 * Type des données attendues comme paramètre de recherche des notifications
 */
export type SearchNotificationsFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  read?: boolean | undefined;
  all?: boolean | undefined;
};
