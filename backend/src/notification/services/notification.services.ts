import { Notification, CreateNotificationData, SearchNotificationsFilter} from "../types/Notification";
import { db } from "../../db";
import { NotificationNotFoundError } from "../errors";
import { Prisma } from "@prisma/client";

/**
 * Créer une nouvelle notification
 * @param {CreateNotificationData} notificationData - données sur la notification à créer
 * @returns {Notification} - la notification créée
 */
export const createNotification = async (notificationData: CreateNotificationData): Promise<Notification> => {
    const newNotification = await db.notification.create({
        data: {
            ...notificationData,
            read:false
        }
    })
    return newNotification;
};

/**
 * Récupère toutes les notifications respectant le filtre de recherche donné
 * @param {SearchNotificationsFilter} filter - filtre de recherche à utiliser
 * @returns {Notification[]} - la liste de notifications respectant le filtre de recherche
 */
export const getNotifications = async (filter: SearchNotificationsFilter): Promise<Notification[]> => {
    const { page, pageSize, ..._ } = filter;
    const where: Prisma.NotificationWhereInput = {};
    console.log(filter.read);
    if (filter.read !== undefined) where.read = filter.read;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const notifications = await db.notification.findMany({
        where,
        skip,
        take
    });
    return notifications;
};

/**
 * Récupère la notification ayant l'identifiant donné
 * @param {string} id - identifiant de la notification
 * @returns {Notification} - la notification ayant l'identifiant donné
 * @throws {NotificationNotFoundError} - lorsqu'aucune notification avec l'identifiant a été trouvée
 */
export const getNotificationById = async (id: string): Promise<Notification> => {
    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) throw new NotificationNotFoundError(id);
    return notification;
};

/**
 * Récupère toutes les notifications de l'utilisateur ayant l'identifiant donné de la plus recente à la moins
 * @param {string} userId - identifiant de l'utilisateur
 * @return {Notification[]} - la liste des notifications de l'utilisateur 
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
    const userNotifications = await db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return userNotifications;
};

/**
 * Marque une notification comme lue
 * @param {string} id - identifiant de la notification
 * @returns {Notification} - la notification modifiée avec le champ read à true
 * @throws {NotificationNotFoundError} - lorsqu'aucune notification avec l'identifiant a été trouvée
 */
export const markNotificationAsRead = async (id: string):Promise<Notification> => {
    try {
        const updatedNotification = await db.notification.update({
            where: { id },
            data:{read:true}
        })
        return updatedNotification;
    } catch (err: any) {
        if (err.code === "P2025") throw new NotificationNotFoundError(id);
        throw err;
    }
};

/**
 * Supprime une notification
 * @param {string} id - identifiant de la notification
 * @throws {NotificationNotFoundError} - lorsqu'aucune notification avec l'identifiant a été trouvée
 */
export const deleteNotification = async (id: string) => {
    try {
        await db.notification.delete({ where: { id } });
    } catch (err: any) {
        if (err.code === "P2025") throw new NotificationNotFoundError(id);
        throw err;
    }
};