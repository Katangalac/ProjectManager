import { Request } from "express";
import { Prisma } from "@prisma/client";
import { SearchNotificationsFilter } from "../types/Notification";
import { SearchTasksFilter } from "../types/Task";
import { SearchTeamsFilter } from "../types/Team";
import { SearchUsersFilter } from "../types/User";
import { SearchProjectsFilter } from "../types/Project";
import { SearchMessagesFilter } from "../types/Message";
import { SearchConversationsFilter } from "../types/Conversation";
import { SearchInvitationFilter } from "../types/Invitation";
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
  obj: T,
): {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
} => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as any;
};

/**
 * Retourne le debut et la fin de la journée associée à une date
 * @param {Date} date - la date dont on veut déterminer le début de l ajournée et la fin
 * @returns le debut et la fin de la journée assoicée à la date
 */
export const getStartAndEndOfDay = (
  date: Date,
): { startOfDay: Date; endOfDay: Date } => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchUsersFilter
 * @param {SearchUsersFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.UserWhereInput } - le filtre construit
 */
export const buildUserWhereInput = (
  filter: SearchUsersFilter,
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
  filter: SearchTeamsFilter,
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
  filter: SearchInvitationFilter,
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
  filter: SearchProjectsFilter,
): Prisma.ProjectWhereInput => {
  const where: Prisma.ProjectWhereInput = {};
  const AND: Prisma.ProjectWhereInput[] = [];

  // ---------- title ----------
  if (filter.title) {
    AND.push({
      title: { contains: filter.title, mode: "insensitive" },
    });
  }

  if (filter.status) {
    AND.push({ status: filter.status });
  }

  // ---------- startedAt ----------
  const startedAtOR: Prisma.ProjectWhereInput[] = [];
  if (filter.startOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.startOn),
    );
    startedAtOR.push({
      startedAt: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.startBefore) {
    const { startOfDay } = getStartAndEndOfDay(new Date(filter.startBefore));
    startedAtOR.push({
      startedAt: { lt: startOfDay },
    });
  }

  if (filter.startAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.startAfter));
    startedAtOR.push({
      startedAt: { gt: endOfDay },
    });
  }

  if (startedAtOR.length) AND.push({ OR: startedAtOR });

  // ---------- deadline ----------
  const deadlineOR: Prisma.ProjectWhereInput[] = [];
  if (filter.endOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.endOn),
    );
    deadlineOR.push({
      deadline: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.endBefore) {
    const { startOfDay } = getStartAndEndOfDay(new Date(filter.endBefore));
    deadlineOR.push({
      deadline: { lt: startOfDay },
    });
  }

  if (filter.endAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.endAfter));
    deadlineOR.push({
      deadline: { gt: endOfDay },
    });
  }

  if (deadlineOR.length) AND.push({ OR: deadlineOR });

  // ---------- completedAt ----------
  const completedAtOR: Prisma.ProjectWhereInput[] = [];
  if (filter.completedOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.completedOn),
    );
    completedAtOR.push({
      completedAt: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.completedBefore) {
    const { startOfDay } = getStartAndEndOfDay(
      new Date(filter.completedBefore),
    );
    completedAtOR.push({
      completedAt: { lt: startOfDay },
    });
  }

  if (filter.completedAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.completedAfter));
    completedAtOR.push({
      completedAt: { gt: endOfDay },
    });
  }

  if (completedAtOR.length) AND.push({ OR: completedAtOR });

  // ---------- progress ----------
  const progressOR: Prisma.ProjectWhereInput[] = [];

  if (filter.progressEq)
    progressOR.push({
      progress: { equals: filter.progressEq },
    });

  if (filter.progressLt)
    progressOR.push({
      progress: { lt: filter.progressLt },
    });

  if (filter.progessGt)
    progressOR.push({
      progress: { gt: filter.progessGt },
    });

  if (progressOR.length) AND.push({ OR: progressOR });

  // ---------- final ----------
  if (AND.length) where.AND = AND;

  return where;
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchTasksFilter
 * @param {SearchTasksFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.TaskWhereInput } - le filtre construit
 */
export const buildTaskWhereInput = (
  filter: SearchTasksFilter,
): Prisma.TaskWhereInput => {
  const AND: Prisma.TaskWhereInput[] = [];

  // ---------- title ----------
  if (filter.title) {
    AND.push({
      title: { contains: filter.title, mode: "insensitive" },
    });
  }

  // ---------- status ----------
  if (filter.statusIn?.length) {
    AND.push({
      status: { in: filter.statusIn },
    });
  } else if (filter.status) {
    AND.push({
      status: filter.status,
    });
  }

  // ---------- startedAt ----------
  const startedAtOR: Prisma.TaskWhereInput[] = [];
  if (filter.startOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.startOn),
    );
    startedAtOR.push({
      startedAt: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.startBefore) {
    const { startOfDay } = getStartAndEndOfDay(new Date(filter.startBefore));
    startedAtOR.push({
      startedAt: { lt: startOfDay },
    });
  }

  if (filter.startAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.startAfter));
    startedAtOR.push({
      startedAt: { gt: endOfDay },
    });
  }

  if (startedAtOR.length) AND.push({ OR: startedAtOR });

  // ---------- deadline ----------
  const deadlineOR: Prisma.TaskWhereInput[] = [];
  if (filter.endOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.endOn),
    );
    deadlineOR.push({
      deadline: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.endBefore) {
    const { startOfDay } = getStartAndEndOfDay(new Date(filter.endBefore));
    deadlineOR.push({
      deadline: { lt: startOfDay },
    });
  }

  if (filter.endAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.endAfter));
    deadlineOR.push({
      deadline: { gt: endOfDay },
    });
  }

  if (deadlineOR.length) AND.push({ OR: deadlineOR });

  // ---------- completedAt ----------
  const completedAtOR: Prisma.TaskWhereInput[] = [];
  if (filter.completedOn) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay(
      new Date(filter.completedOn),
    );
    completedAtOR.push({
      completedAt: { gte: startOfDay, lte: endOfDay },
    });
  }

  if (filter.completedBefore) {
    const { startOfDay } = getStartAndEndOfDay(
      new Date(filter.completedBefore),
    );
    completedAtOR.push({
      completedAt: { lt: startOfDay },
    });
  }

  if (filter.completedAfter) {
    const { endOfDay } = getStartAndEndOfDay(new Date(filter.completedAfter));
    completedAtOR.push({
      completedAt: { gt: endOfDay },
    });
  }

  if (completedAtOR.length) AND.push({ OR: completedAtOR });

  // ---------- priorityLevel ----------
  const priorityOR: Prisma.TaskWhereInput[] = [];
  if (filter.priorityLevelEq)
    priorityOR.push({
      priorityLevel: { equals: filter.priorityLevelEq },
    });
  if (filter.priorityLevelLt)
    priorityOR.push({
      priorityLevel: { lt: filter.priorityLevelLt },
    });
  if (filter.priorityLevelGt)
    priorityOR.push({
      priorityLevel: { gt: filter.priorityLevelGt },
    });

  if (priorityOR.length) AND.push({ OR: priorityOR });

  if (filter.priorityLevelIn?.length) {
    AND.push({
      priorityLevel: { in: filter.priorityLevelIn },
    });
  }

  // ---------- progress ----------
  const progressOR: Prisma.TaskWhereInput[] = [];
  if (filter.progressEq)
    progressOR.push({
      progress: { equals: filter.progressEq },
    });
  if (filter.progressLt)
    progressOR.push({
      progress: { lt: filter.progressLt },
    });
  if (filter.progessGt)
    progressOR.push({
      progress: { gt: filter.progessGt },
    });

  if (progressOR.length) AND.push({ OR: progressOR });

  // ---------- final ----------
  return AND.length ? { AND } : {};
};

/**
 * Construit dynamiquement le filtre Prisma à partir d'un SearchNotificationsFilter
 * @param {SearchNotificationsFilter} filter - l'objet contenant les éléments de filtre à utiliser
 * @return {Prisma.NotificationWhereInput } - le filtre construit
 */
export const buildNotificationWhereInput = (
  filter: SearchNotificationsFilter,
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
  filter: SearchMessagesFilter,
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
  filter: SearchConversationsFilter,
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
  totalItems: number,
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
