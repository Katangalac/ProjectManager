import { z } from "zod";
import {
  notificationSchema,
  createNotificationSchema,
  searchNotificationsFilterSchema,
} from "@/schemas/notification.schemas";
import { Pagination } from "@/types/Pagination";

/**
 * Type représentant les données attendues pour une notification dans la BD
 */
export type Notification = z.infer<typeof notificationSchema>;

/**
 * Type représentant les données attendues lors de la création d'une notification
 */
export type CreateNotificationData = z.infer<typeof createNotificationSchema>;

/**
 * Type représentant les données attendues comme filtre lors de la recherche des notification
 */
export type SearchNotificationsFilter = z.infer<
  typeof searchNotificationsFilterSchema
>;

/**
 * Type représentant une liste des notifications ainsi que les informations sur la pagination
 */
export type NotificationsCollection = {
  notifications: Notification[];
  pagination: Pagination;
};
