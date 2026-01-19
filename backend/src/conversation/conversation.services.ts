import { Conversation, CreateConversationData } from "./Conversation";
import { db } from "../db";
import { SafeUser, SearchUsersFilter } from "../user/User";
import { toSafeUser } from "../user/user.transforms";
import { getTeamMembers } from "../team/team.services";
import { Message, SearchMessagesFilter } from "../message/Message";
import { UserConversation } from "@prisma/client";
import {
  ConversationNotFoundError,
  UserAlreadyInConversationError,
  NotEnoughParticipantsInConversationError,
} from "./errors";
import { searchUsersFilterSchema } from "../user/user.schemas";
import {
  buildUserWhereInput,
  buildMessageWhereInput,
  buildPaginationInfos,
} from "../utils/utils";
import { Prisma } from "@prisma/client";
import { UsersCollection } from "../user/User";
import { MessagesCollection } from "../message/Message";
import { getIO } from "../socket/socket";

/**
 * Crée une nouvelle conversation
 * @async
 * @param conversationData - informations sur la conversation à créer
 * @returns {Coversation} - la conversation créée
 * @throws {NotEnoughParticipantsInConversationError} - lorsqu'il n'y a pas assez des participants dans la conversation
 */
export const createConversation = async (
  conversationData: CreateConversationData,
): Promise<Conversation> => {
  const { participantIds, teamId, ...conversationInfo } = conversationData;
  let finalParticipantIds = [...participantIds];
  if (teamId) {
    //const memberFilter = searchUsersFilterSchema.parse({ all: true });
    const teamMembers = await getTeamMembers(teamId, {
      page: 1,
      pageSize: 20,
      all: true,
    });
    const teamMemberIds = teamMembers.users.map((user) => user.id);
    finalParticipantIds = Array.from(
      new Set([...finalParticipantIds, ...teamMemberIds]),
    );
  }

  if (!finalParticipantIds || finalParticipantIds.length < 1)
    throw new NotEnoughParticipantsInConversationError();
  const conversation = await db.conversation.create({
    data: {
      ...conversationInfo,
      teamId,
      participants: {
        create: finalParticipantIds.map((userId) => ({ userId })),
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      },
    },
  });

  try {
    const io = getIO();
    if (conversation.teamId) {
      io.to(conversation.teamId).emit("new_conversation", conversation.id);
    }
  } catch (err: any) {
    console.error("Erreur lors de socket-io : ", err);
  }

  return conversation;
};

/**
 * Récupère la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - identifiant de la conversation
 * @returns {Conversation} - la conversation possedant l'identifiant passé en paramètre
 * @throws {ConversationNotFoundError} - lorsqu'aucune conversation possedant l'identifiant a été trouvée
 */
export const getConversationById = async (
  id: string,
): Promise<Conversation> => {
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      },

      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!conversation) throw new ConversationNotFoundError(id);
  return conversation;
};

/**
 * Met à jour la date de modification d'une conversation
 * @async
 * @param {string} id - identifiant de la conversation
 * @returns {Conversation} - la conversation mise à jour
 * @throws {ConversationNotFoundError} - lorsqu'aucune conversation possedant l'identifiant a été trouvée
 */
export const updateConversation = async (id: string): Promise<Conversation> => {
  try {
    const updatedConversation = await db.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
    return updatedConversation;
  } catch (err: any) {
    if (err.code === "P2025") throw new ConversationNotFoundError(id);
    throw err;
  }
};

/**
 * Récupère les utilisateurs impliqués dans une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @param {SearchUsersFilter} filter - filtre de recherche à utiliser
 * @returns {UsersCollection} - la liste des participants
 */
export const getConversationParticipants = async (
  conversationId: string,
  filter: SearchUsersFilter,
): Promise<UsersCollection> => {
  const { page, pageSize, all, ..._ } = filter;
  const conversatioParticipantCondition: Prisma.UserWhereInput = {
    userConversations: {
      some: { conversationId },
    },
  };

  //Construction du WHERE à partir des filtres
  const userFilter = buildUserWhereInput(filter);

  //Compte total d'utilisateurs correspondant au filtre
  const totalItems = await db.user.count({
    where: {
      AND: [conversatioParticipantCondition, userFilter],
    },
  });

  //Construction de la requête principale
  const query: Prisma.UserFindManyArgs = {
    where: {
      AND: [conversatioParticipantCondition, userFilter],
    },
    orderBy: { updatedAt: "desc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const participants = await db.user.findMany(query);
  const safeParticipants = participants.map(toSafeUser);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    users: safeParticipants,
    pagination,
  };
};

/**
 * Récupère les messages d'une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @param {SearchMessagesFilter} filter - filtre de recherche à utiliser
 * @returns {MessagesCollection} - la liste des messages
 */
export const getConversationMessages = async (
  conversationId: string,
  filter: SearchMessagesFilter,
): Promise<MessagesCollection> => {
  const { page, pageSize, all, ..._ } = filter;

  //Construction du WHERE à partir des filtres
  const messageFilter = buildMessageWhereInput(filter);

  //Compte total des messages correspondant au filtre
  const totalItems = await db.message.count({
    where: {
      AND: [{ conversationId }, messageFilter],
    },
  });

  //Construction de la requête principale
  const query: Prisma.MessageFindManyArgs = {
    where: {
      AND: [{ conversationId }, messageFilter],
    },
    include: {
      attachments: true,
      sender: true,
    },
    orderBy: { createdAt: "asc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const messages = await db.message.findMany(query);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    messages,
    pagination,
  };
};

/**
 * Ajoute un utilisateur dans une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @param {string} userId  - identifiant de l'utilisateur
 * @returns {UserConversation} - un objet representant la connexion entre l'utilisateur et la conversation
 * @throws {UserAlreadyInConversationError} - si l'utilisateur est déjà dans la conversation
 */
export const addParticipantToConversation = async (
  conversationId: string,
  userId: string,
): Promise<UserConversation> => {
  try {
    const userConversationPair = await db.userConversation.create({
      data: { conversationId, userId },
    });
    const participantsCount = await db.userConversation.count({
      where: { conversationId },
    });
    if (participantsCount > 2) {
      await db.conversation.update({
        where: { id: conversationId },
        data: { isGroup: true },
      });
    }
    return userConversationPair;
  } catch (err: any) {
    if (err.code === "P2002")
      throw new UserAlreadyInConversationError(userId, conversationId);
    throw err;
  }
};

/**
 * Supprime une conversation
 * @param {string} id - identifiant de la conversation
 * @throws {ConversationNotFoundError} - lorsqu'aucune conversation possedant l'identifiant a été trouvée
 */
export const deleteConversation = async (id: string) => {
  try {
    await db.conversation.delete({ where: { id } });
  } catch (err: any) {
    if (err.code === "P2025") throw new ConversationNotFoundError(id);
    throw err;
  }
};
