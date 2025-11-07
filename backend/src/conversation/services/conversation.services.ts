import { Conversation, CreateConversationData } from "../types/Conversation";
import { db } from "../../db";
import { SafeUser } from "../../user/types/User";
import { toSafeUser } from "../../user/services/user.transforms";
import { getTeamMembers } from "../../team/services/team.services";
import { Message } from "../../message/types/Message";
import { UserConversation } from "@prisma/client";
import { ConversationNotFoundError,UserAlreadyInConversationError,NotEnoughParticipantsInConversationError } from "../errors";

/**
 * Crée une nouvelle conversation
 * @async
 * @param conversationData - informations sur la conversation à créer
 * @returns {Coversation} - la conversation créée
 * @throws {NotEnoughParticipantsInConversationError} - lorsqu'il n'y a pas assez des participants dans la conversation
 */
export const createConversation = async (conversationData: CreateConversationData): Promise<Conversation> => {
    const { participantIds, teamId, ...conversationInfo } = conversationData;
    let finalParticipantIds = [...participantIds];
    if (teamId) {
        const teamMembers = await getTeamMembers(teamId);
        const teamMemberIds = teamMembers.map((user) => user.id);
        finalParticipantIds = Array.from(new Set([...finalParticipantIds, ...teamMemberIds]));
    }
    if (!finalParticipantIds || finalParticipantIds.length < 1) throw new NotEnoughParticipantsInConversationError();
    const conversation = await db.conversation.create({
        data: {
            ...conversationInfo,
            teamId,
            participants: {
                create: finalParticipantIds.map((userId) => ({ userId }))
            }
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
                            email: true
                        }
                    }
                    
                 },
            }
        }
    });
    return conversation;
};

/**
 * Récupère la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {string} id - identifiant de la conversation
 * @returns {Conversation} - la conversation possedant l'identifiant passé en paramètre
 * @throws {ConversationNotFoundError} - lorsqu'aucune conversation possedant l'identifiant a été trouvée
 */
export const getConversationById = async (id: string): Promise<Conversation> => {
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
                            phoneNumber:true,
                            email: true,
                        }
                    }
                }
            },

            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        }
    });
    if (!conversation) throw new ConversationNotFoundError(id);
    return conversation;
}

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
            data: {updatedAt: new Date()}
        });
        return updatedConversation;
    } catch (err:any) {
        if (err.code === "P2025")throw new ConversationNotFoundError(id);
        throw err;
    }
};

/**
 * Récupère les conversations d'un utilisateur en incluant les participants ainsi que le dernier message 
 * envoyé dans chacune de ces conversations
 * @async
 * @param {string} userId - identifiant de l'utilisateur
 * @returns {Conversation[]} - la liste de conversations de l'utilisateur
 */
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
    const userConversations = await db.conversation.findMany({
        where: {
            participants: {
                some: { userId }
            }
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phoneNumber:true,
                            email: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    return userConversations;
};

/**
 * Récupère les utilisateurs impliqués dans une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @returns {SafeUser[]} - la liste des participants
 */
export const getConversationParticipants = async (conversationId: string): Promise<SafeUser[]> => {
    const participants = await db.user.findMany({
        where: {
            userConversations: {
                some: { conversationId }
            }
        }
    });
    const safeParticipants = participants.map(toSafeUser);
    return safeParticipants;
};

/**
 * Récupère les messages d'une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @returns {Message[]} - la liste des messages
 */
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
    const messages = await db.message.findMany({
        where: { conversationId },
        include: {
            attachments:true
        },
        orderBy:{createdAt:"asc"}
    });
    return messages;
};

/**
 * Ajoute un utilisateur dans une conversation
 * @async
 * @param {string} conversationId - identifiant de la conversation
 * @param {string} userId  - identifiant de l'utilisateur
 * @returns {UserConversation} - un objet representant la connexion entre l'utilisateur et la conversation
 * @throws {UserAlreadyInConversationError} - si l'utilisateur est déjà dans la conversation
 */
export const addParticipantToConversation = async (conversationId: string, userId: string):Promise<UserConversation> => {
    try {
        const userConversationPair = await db.userConversation.create({
            data: { conversationId, userId }
        });
        const participantsCount = await db.userConversation.count({
            where:{conversationId}
        });
        if (participantsCount > 2) {
            await db.conversation.update({
                where: { id: conversationId },
                data: { isGroup: true },
            });
        }
        return userConversationPair;
    } catch (err: any) {
        if (err.code === "P2002") throw new UserAlreadyInConversationError(userId, conversationId);
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
        await db.conversation.delete({where: { id }});
    }catch (err:any) {
        if (err.code === "P2025")throw new ConversationNotFoundError(id);
        throw err;
    }
};
