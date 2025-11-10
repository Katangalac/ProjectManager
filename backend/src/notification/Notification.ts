import { z } from "zod";
import {notificationSchema, createNotificationSchema, searchNotificationsFilterSchema } from "./notification.schemas";

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
export type SearchNotificationsFilter = z.infer<typeof searchNotificationsFilterSchema>;
