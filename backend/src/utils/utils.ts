import { Request } from "express";
import { Prisma } from "@prisma/client";
import { SearchNotificationsFilter } from "../notification/Notification";
import { SearchTasksFilter } from "../task/Task";
import { SearchTeamsFilter } from "../team/Team";
import { SearchUsersFilter } from "../user/User";
import { SearchProjectsFilter } from "../project/Project";
import { SearchMessagesFilter } from "../message/Message";
import { SearchConversationsFilter } from "../conversation/Conversation";
import { Pagination } from "../types/Pagination";

//Format des numéros de téléphone
export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Recupère l'id d'un utilisateur contenu dans une requête
 * Si l'utilisateur est authentifié, l'id est contenu dans la propriété user de la requête
 * Sinon, l'id est recupéré parmi le paramètre de la requête
 */
export const getUserIdFromRequest = (req: Request): string | undefined => {
    return req.params.id ?? req.user?.sub;
};

/**
 * Retire les propriétés/champs d'un objet ayant la valeur undefined
 * @param {T} obj - un objet qui peut être de n'importe quel type
 * @returns l'objet passé en  paramètre sans les propriétés/champs qui étaient undefined
 */
export const removeUndefined = <T extends Record<string, any>>(obj: T): {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
} => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as any;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchUsersFilter
 * @param {SearchUsersFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.UserWhereInput } - le filtre construit
 */
export const buildUserWhereInput = (filter: SearchUsersFilter): Prisma.UserWhereInput => {
    const where: Prisma.UserWhereInput = {};
    if (filter.email) where.email = { contains: filter.email, mode: 'insensitive' };
    if (filter.userName) where.userName = { contains: filter.userName, mode: 'insensitive' };
    if (filter.firstName) where.firstName = { contains: filter.firstName, mode: 'insensitive' };
    if (filter.lastName) where.lastName = { contains: filter.lastName, mode: 'insensitive' };
    if (filter.profession) where.profession = { contains: filter.profession, mode: 'insensitive' };
    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchTeamsFilter
 * @param {SearchTeamsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.TeamWhereInput } - le filtre construit
 */
export const buildTeamWhereInput = (filter: SearchTeamsFilter): Prisma.TeamWhereInput => {
    const where: Prisma.TeamWhereInput = {};
    if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchProjectsFilter
 * @param {SearchProjectsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.ProjectWhereInput } - le filtre construit
 */
export const buildProjectWhereInput = (filter: SearchProjectsFilter): Prisma.ProjectWhereInput => {
    const where: Prisma.ProjectWhereInput = {};
    if (filter.title) where.title = { contains: filter.title, mode: 'insensitive' };
    if (filter.status) where.status = filter.status;
    if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) }
    if (filter.startBefore) where.startedAt = { lt: new Date(filter.startBefore) }
    if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) }
    if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) }
    if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) }
    if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) }
    if (filter.completedOn) where.completedAt = { equals: new Date(filter.completedOn) }
    if (filter.completedBefore) where.completedAt = { lt: new Date(filter.completedBefore) }
    if (filter.completedAfter) where.completedAt = { gt: new Date(filter.completedAfter) }
    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchTasksFilter
 * @param {SearchTasksFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.TaskWhereInput } - le filtre construit
 */
export const buildTaskWhereInput = (filter: SearchTasksFilter): Prisma.TaskWhereInput => {
    const where: Prisma.TaskWhereInput = {};

    if (filter.title) where.title = { contains: filter.title, mode: 'insensitive' };
    if (filter.status) where.status = filter.status;

    if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) };
    if (filter.startBefore) where.startedAt = { lt: new Date(filter.startBefore) };
    if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) };

    if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) };
    if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) };
    if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) };

    if (filter.completedOn) where.completedAt = { equals: new Date(filter.completedOn) };
    if (filter.completedBefore) where.completedAt = { lt: new Date(filter.completedBefore) };
    if (filter.completedAfter) where.completedAt = { gt: new Date(filter.completedAfter) };

    if (filter.priorityLevelEq) where.priorityLevel = { equals: filter.priorityLevelEq };
    if (filter.priorityLevelLt) where.priorityLevel = { lt: filter.priorityLevelLt };
    if (filter.priorityLevelGt) where.priorityLevel = { gt: filter.priorityLevelGt };

    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchNotificationsFilter
 * @param {SearchNotificationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.NotificationWhereInput } - le filtre construit
 */
export const buildNotificationWhereInput = (filter: SearchNotificationsFilter): Prisma.NotificationWhereInput => {
    const where: Prisma.NotificationWhereInput = {};
    if (filter.read !== undefined) where.read = filter.read;
    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchMessagesFilter
 * @param {SearchMessagesFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.MessageWhereInput } - le filtre construit
 */
export const buildMessageWhereInput = (filter: SearchMessagesFilter): Prisma.MessageWhereInput => {
    const where: Prisma.MessageWhereInput = {};
    if (filter.read !== undefined) where.read = filter.read;
    return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchConversationFilter
 * @param {SearchCoversationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.ConversationWhereInput } - le filtre construit
 */
export const buildConversationWhereInput = (filter: SearchConversationsFilter): Prisma.ConversationWhereInput => {
    const where: Prisma.ConversationWhereInput = {};
    if (filter.isGroup !== undefined) where.isGroup = filter.isGroup;
    if (filter.teamId) where.teamId = { equals: filter.teamId };
    return where;
};

/**
 * Construit les informations de pagination
 * @param {boolean} all - indique si tous les items ont été demandés
 * @param {number} page - indique le numéro de la page demandé
 * @param {number} pageSize - indique le nombre d'items par page demandé
 * @param {number} totalItems - indique le nombre total d'items
 */
export const buildPaginationInfos = (all:boolean|undefined, page:number, pageSize:number, totalItems:number): Pagination => {
    const totalPages = all ? 1 : Math.ceil(totalItems / pageSize);
    const pagination: Pagination = {
        page: all ? "All" : page,
        pageSize: all ? "All" : pageSize,
        totalItems,
        totalPages,
        hasNextPage: !all && page < totalPages,
        hasPreviousPage: !all && page > 1,
    };
    return pagination;
};




