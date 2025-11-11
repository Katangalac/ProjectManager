import { Request, Response } from "express";
import * as conversationService from "./conversation.services";
import * as conversationSchema from "./conversation.schemas";
import { ConversationNotFoundError, UserAlreadyInConversationError, NotEnoughParticipantsInConversationError } from "./errors";
import { z } from "zod";
import { idParamSchema } from "../schemas/idparam.schema";
import { searchMessagesFilterSchema } from "../message/message.schemas";
import { searchUsersFilterSchema } from "../user/user.schemas";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * Crée une nouvelle conversation
 * @async
 * @param {Request} req - requete Express contenant les informations sur la conversation à créer
 * @param {Response} res - reponse express en JSON
 */
export const createConversationController = async (req: Request, res: Response) => {
    try {
        const conversationData = conversationSchema.createConversationSchema.parse(req.body);
        const conversation = await conversationService.createConversation(conversationData);
        res.status(201).json(successResponse(conversation, "Conversation créée"));
    } catch (err) {
        console.error("Erreur lors de la création de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        if (err instanceof NotEnoughParticipantsInConversationError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la création de la conversation"));
    }
};

/**
 * Récupère la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation 
 * @param {Response} res - reponse express en JSON
 */
export const getConversationByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const conversation = await conversationService.getConversationById(id);
        res.status(200).json(successResponse(conversation, "Conversation récupérée"));
    } catch (err) {
        console.error("Erreur lors de la récupération de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json(errorResponse(err.code?err.code:"CONVERSATION_NOT_FOUND", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la récupération de la conversation"));
    }
};

/**
 * Met à jour la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation 
 * @param {Response} res - reponse express en JSON
 */
export const updateConversationController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const updatedConversation = await conversationService.updateConversation(id);
        res.status(200).json(successResponse(updatedConversation, "Conversation mise à jour"));
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json(errorResponse(err.code?err.code:"CONVERSATION_NOT_FOUND", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la mise à jour de la conversation"));
    }
};

/**
 * Récupère les participants de la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation 
 * @param {Response} res - reponse express en JSON
 */
export const getConversationsParticipantsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchUsersFilterSchema.parse(req.query);
        const participants = await conversationService.getConversationParticipants(id, filter);
        res.status(200).json(successResponse(participants.users, "Participants de la conversation récupérés", participants.pagination));
    } catch (err) {
        console.error("Erreur lors de la récupération des participants de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la récupération des participants de la conversation"));
    }
};

/**
 * Récupère les message de la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation 
 * @param {Response} res - reponse express en JSON
 */
export const getConversationMessagesController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchMessagesFilterSchema.parse(req.query);
        const messagesCollection = await conversationService.getConversationMessages(id, filter);
        res.status(200).json(successResponse(messagesCollection.messages, "Messages de la conversation récupérées", messagesCollection.pagination));
    } catch (err) {
        console.error("Erreur lors de la récupération des messages de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la récupération des messages de la conversation"));
    }
};

/**
 * Ajoute un participant(utilisateur) dans une conversation
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation et de l'utilisateur
 * @param {Response} res - reponse express en JSON
 */
export const addParticipantToConversationController = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = idParamSchema.parse({ id: req.params.id });
        const { id: userId } = idParamSchema.parse({ id: req.params.userId });
        const userConversationPair = await conversationService.addParticipantToConversation(conversationId, userId);
        res.status(200).json(successResponse(userConversationPair, "Utilisateur ajouté dans la conversation"));
    } catch (err) {
        console.error("Erreur lors de l'ajout d'un participant dans la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        if (err instanceof UserAlreadyInConversationError) {
            res.status(409).json(errorResponse(err.code?err.code:"USER_ALREADY_IN_CONVERSATION", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de l'ajout d'un participant dans la conversation"));
    }
};

/**
 * Supprime la conversation ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de la conversation 
 * @param {Response} res - reponse express en JSON
 */
export const deleteConversationController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        await conversationService.deleteConversation(id);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json(errorResponse(err.code?err.code:"CONVERSATION_NOT_FOUND", err.message));
        }
        res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la suppression de la conversation"));
    }
};
