import { Notification, CreateNotificationData, SearchNotificationsFilter} from "./Notification";
import { db } from "../db";
import { NotificationNotFoundError } from "./errors";
import { buildNotificationWhereInput, buildPaginationInfos } from "../utils/utils";
import { Prisma } from "@prisma/client";
import { NotificationsCollection } from "./Notification";

/**
 * Créer une nouvelle notification
 * @param {CreateNotificationData} notificationData - données sur la notification à créer
 * @returns {Notification} - la notification créée
 */
export const sendNotification = async (notificationData: CreateNotificationData): Promise<Notification> => {
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
 * @returns {NotificationsCollection} - la liste de notifications respectant le filtre de recherche
 */
export const getNotifications = async (filter: SearchNotificationsFilter): Promise<NotificationsCollection> => {
    const { page, pageSize, all, ..._ } = filter;
    
    //Construction du WHERE à partir des filtres
    const where = buildNotificationWhereInput(filter);

    //Compte total des notifications correspondant au filtre
    const totalItems = await db.notification.count({where});
    
    //Construction de la requête principale
    const query: Prisma.NotificationFindManyArgs = {
        where,
        orderBy:{createdAt:"desc"}
    };

    if (!all) {
        query.skip = (page - 1) * pageSize;
        query.take = pageSize;
    }

    //Exécution de la requête
    const notifications = await db.notification.findMany(query);

    //Calcul pagination
    const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

    return {
        notifications,
        pagination
    };
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