import { Request } from "express";
import { Prisma } from "@prisma/client";
import { SearchNotificationsFilter } from "../notification/Notification";
import { SearchTasksFilter } from "../task/Task";
import { SearchTeamsFilter } from "../team/Team";
import { SearchUsersFilter } from "../user/User";
import { SearchProjectsFilter } from "../project/Project";
import { SearchMessagesFilter } from "../message/Message";
import { SearchConversationsFilter } from "../conversation/Conversation";
import { SearchInvitationFilter } from "../invitation/Invitation";
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
export const removeUndefined = <T extends Record<string, any>>(
  obj: T
): {
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
export const buildUserWhereInput = (
  filter: SearchUsersFilter
): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};
  const OR: Prisma.UserWhereInput[] = [];

  if (filter.email)
    OR.push({ email: { contains: filter.email, mode: "insensitive" } });
  if (filter.userName)
    OR.push({ userName: { contains: filter.userName, mode: "insensitive" } });
  if (filter.firstName)
    OR.push({ firstName: { contains: filter.firstName, mode: "insensitive" } });
  if (filter.lastName)
    OR.push({ lastName: { contains: filter.lastName, mode: "insensitive" } });
  if (filter.profession)
    OR.push({
      profession: { contains: filter.profession, mode: "insensitive" },
    });

  if (OR.length === 0) return {};
  return { OR };
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchTeamsFilter
 * @param {SearchTeamsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.TeamWhereInput } - le filtre construit
 */
export const buildTeamWhereInput = (
  filter: SearchTeamsFilter
): Prisma.TeamWhereInput => {
  const where: Prisma.TeamWhereInput = {};
  if (filter.name) where.name = { contains: filter.name, mode: "insensitive" };
  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchInvitationsFilter
 * @param {SearchInvitationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.InvitationWhereInput } - le filtre construit
 */
export const buildInvitationWhereInput = (
  filter: SearchInvitationFilter
): Prisma.InvitationWhereInput => {
  const where: Prisma.InvitationWhereInput = {};
  if (filter.senderId) where.senderId = filter.senderId;
  if (filter.receiverId) where.receiverId = filter.receiverId;
  if (filter.teamId) where.teamId = filter.teamId;
  if (filter.status) where.status = filter.status;
  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchProjectsFilter
 * @param {SearchProjectsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.ProjectWhereInput } - le filtre construit
 */
export const buildProjectWhereInput = (
  filter: SearchProjectsFilter
): Prisma.ProjectWhereInput => {
  const where: Prisma.ProjectWhereInput = {};
  if (filter.title)
    where.title = { contains: filter.title, mode: "insensitive" };

  if (filter.status) where.status = filter.status;

  if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) };
  if (filter.startBefore)
    where.startedAt = { lt: new Date(filter.startBefore) };
  if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) };

  if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) };
  if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) };
  if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) };

  if (filter.completedOn)
    where.completedAt = { equals: new Date(filter.completedOn) };
  if (filter.completedBefore)
    where.completedAt = { lt: new Date(filter.completedBefore) };
  if (filter.completedAfter)
    where.completedAt = { gt: new Date(filter.completedAfter) };

  if (filter.progressEq) where.progress = { equals: filter.progressEq };
  if (filter.progressLt) where.progress = { lt: filter.progressLt };
  if (filter.progessGt) where.progress = { gt: filter.progessGt };
  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchTasksFilter
 * @param {SearchTasksFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.TaskWhereInput } - le filtre construit
 */
export const buildTaskWhereInput = (
  filter: SearchTasksFilter
): Prisma.TaskWhereInput => {
  const where: Prisma.TaskWhereInput = {};

  if (filter.title)
    where.title = { contains: filter.title, mode: "insensitive" };
  if (filter.status) where.status = filter.status;

  if (filter.startOn) where.startedAt = { equals: new Date(filter.startOn) };
  if (filter.startBefore)
    where.startedAt = { lt: new Date(filter.startBefore) };
  if (filter.startAfter) where.startedAt = { gt: new Date(filter.startAfter) };

  if (filter.endOn) where.deadline = { equals: new Date(filter.endOn) };
  if (filter.endBefore) where.deadline = { lt: new Date(filter.endBefore) };
  if (filter.endAfter) where.deadline = { gt: new Date(filter.endAfter) };

  if (filter.completedOn)
    where.completedAt = { equals: new Date(filter.completedOn) };
  if (filter.completedBefore)
    where.completedAt = { lt: new Date(filter.completedBefore) };
  if (filter.completedAfter)
    where.completedAt = { gt: new Date(filter.completedAfter) };

  if (filter.priorityLevelEq)
    where.priorityLevel = { equals: filter.priorityLevelEq };
  if (filter.priorityLevelLt)
    where.priorityLevel = { lt: filter.priorityLevelLt };
  if (filter.priorityLevelGt)
    where.priorityLevel = { gt: filter.priorityLevelGt };

  if (filter.progressEq) where.progress = { equals: filter.progressEq };
  if (filter.progressLt) where.progress = { lt: filter.progressLt };
  if (filter.progessGt) where.progress = { gt: filter.progessGt };

  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchNotificationsFilter
 * @param {SearchNotificationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.NotificationWhereInput } - le filtre construit
 */
export const buildNotificationWhereInput = (
  filter: SearchNotificationsFilter
): Prisma.NotificationWhereInput => {
  const where: Prisma.NotificationWhereInput = {};
  if (filter.read !== undefined) where.read = filter.read;
  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchMessagesFilter
 * @param {SearchMessagesFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.MessageWhereInput } - le filtre construit
 */
export const buildMessageWhereInput = (
  filter: SearchMessagesFilter
): Prisma.MessageWhereInput => {
  const where: Prisma.MessageWhereInput = {};
  if (filter.read !== undefined) where.read = filter.read;
  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchConversationFilter
 * @param {SearchCoversationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.ConversationWhereInput } - le filtre construit
 */
export const buildConversationWhereInput = (
  filter: SearchConversationsFilter
): Prisma.ConversationWhereInput => {
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
export const buildPaginationInfos = (
  all: boolean | undefined,
  page: number,
  pageSize: number,
  totalItems: number
): Pagination => {
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

/**
 * Retourne le message de bienvenue dans un html
 */
export const getWelcomeMessageHtml = (userName: string): string => {
  const html = `<h2>Welcome ${userName} 👋</h2><p>Thanks for joining ProjectFlow 🚀</p>`;
  return html;
};

/** Retourne le message de reset de mot de passe */
export const getForgetPasswordMessageHtml = (resetUrl: string): string => {
  const html = `
    <h2>Reset your password 🔐</h2>
    <p>You requested to reset your password for your ProjectManager account.</p>
    <p>Click the link below to choose a new password:</p>
    <p><a href="${resetUrl}" style="color:#3b82f6;">Reset Password</a></p>
    <p>This link is valid for 15 minutes.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  `;
  return html;
};
