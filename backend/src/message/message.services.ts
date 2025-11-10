import { Message, CreateMessageData, EditMessageData } from "./Message";
import { MessageNotFoundError, NotUserMessageError } from "./errors";
import { db } from "../db";
import { getIO } from "../chat/chat.socket";

/**
 * Crée et envoie un nouveau message
 * @async
 * @param {CreateMessageData} messageData - les informations sur le message à créer
 * @returns {Message} - le message créé
 */
export const sendMessage = async (messageData: CreateMessageData): Promise<Message> => {
    const { attachments, ...messageInfos } = messageData;
    const message = await db.message.create({
        data: {
            ...messageInfos,
            attachments: {
                create: attachments || []
            }
        },
        include: {
            attachments: true,
            sender: {
                select: {
                    id: true,
                    userName: true,
                    firstName: true,
                    lastName: true,
                    email:true
                }
            }
        }
    });

    const io = getIO();
    io.to(messageData.conversationId).emit("new_message", message);

    return message;
};

/**
 * Modifie un message
 * @async
 * @param {string} messageId - identifiant du message
 * @param {EditMessageData} updateData - objet contenant l'identifiant du modificateur ainsi que le nouveau contenu du message
 * @returns {Message} - le message modifié
 * @throws {MessageNotFoundError} - lorsqu'aucun message avec l'identifiant passé en paramètre n'a été trouvé
 * @throws {NotUserMessageError} - lorsque l'utilisateur qui essaye de modifier le message n'en est pas le propriétaire
 */
export const editMessage = async (messageId: string, updateData: EditMessageData): Promise<Message> => {
    const { userId, newContent } = updateData;
    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message) throw new MessageNotFoundError(messageId);
    if (message.senderId !== userId) throw new NotUserMessageError(userId, messageId);
    const updatedMessage = await db.message.update({
        where: { id: messageId },
        data: { content: newContent, updatedAt: new Date() }
    });

    const io = getIO();
    io.to(updatedMessage.conversationId).emit("message_edited", message);

    return updatedMessage;
};

/**
 * Marque un message comme lu
 * @async
 * @param {string} messageId - identifiant du message
 * @param {string} userId - identifiant de l'utilisateur ayant lu le message
 * @returns {Message} - le message modifié (marqué lu)
 */
export const markMessageAsRead = async (messageId: string, userId: string): Promise<Message> => {
    try {
        const updatedMessage = await db.message.update({
            where: { id: messageId },
            data: { read: true }
        });

        const io = getIO();
        io.to(updatedMessage.conversationId).emit("message_read", {messageId, userId});

        return updatedMessage;
    } catch (err: any) {
        if (err.code === "P2025") throw new MessageNotFoundError(messageId);
        throw err;
    }
};

/**
 * Supprime le message ayant l'identifiant passé en paramètre
 * @async
 * @param {string} messageId - identifiant du message
 * @throws {MessageNotFoundError} - lorsqu'aucun message avec l'identifiant passé en paramètre n'a été trouvé
 * @throws {NotUserMessageError} - lorsque l'utilisateur qui essaye de supprimer le message n'en est pas le propriétaire
 */
export const deleteMessage = async (messageId: string, userId: string) => {
    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message) throw new MessageNotFoundError(messageId);
    if (message.senderId !== userId) throw new NotUserMessageError(userId, messageId);
    await db.message.delete({ where: { id: messageId } });

    const io = getIO();
    io.to(message.conversationId).emit("message_deleted", messageId);
};

