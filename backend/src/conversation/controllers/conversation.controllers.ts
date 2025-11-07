import { Request, Response } from "express";
import * as conversationService from "../services/conversation.services";
import * as conversationSchema from "../schemas/conversation.schemas";
import { ConversationNotFoundError, UserAlreadyInConversationError, NotEnoughParticipantsInConversationError } from "../errors";
import { z } from "zod";
import { idParamSchema } from "../../schemas/idparam.schema";

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
        res.status(201).json({ message: "Conversation créée", newConversation: conversation });
    } catch (err) {
        console.error("Erreur lors de la création de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof NotEnoughParticipantsInConversationError) {
            res.status(400).json({ erreur: "Pas assez des participants (id) pour créer une conversation" });
        }
        res.status(500).json({ erreur: "Erreur lors de la création de la conversation" });
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
        res.status(200).json(conversation);
    } catch (err) {
        console.error("Erreur lors de la récupération de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json({ erreur: "Aucune conversation ayant l'identifiant passé en paramètre a été trouvée" });
        }
        res.status(500).json({ erreur: "Erreur lors de la récupération de la conversation" });
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
        const conversation = await conversationService.updateConversation(id);
        res.status(200).json(conversation);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json({ erreur: "Aucune conversation ayant l'identifiant passé en paramètre a été trouvée" });
        }
        res.status(500).json({ erreur: "Erreur lors de la mise à jour de la conversation" });
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
        const participants = await conversationService.getConversationParticipants(id);
        res.status(200).json(participants);
    } catch (err) {
        console.error("Erreur lors de la récupération des participants de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        res.status(500).json({ erreur: "Erreur lors de la récupération des participants de la conversation" });
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
        const messages = await conversationService.getConversationMessages(id);
        res.status(200).json(messages);
    } catch (err) {
        console.error("Erreur lors de la récupération des messages de la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        res.status(500).json({ erreur: "Erreur lors de la récupération des messages de la conversation" });
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
        res.status(200).json({message:"Utilisateur ajouté dans la conversation", newUserConversation:userConversationPair});
    } catch (err) {
        console.error("Erreur lors de l'ajout d'un participant dans la conversation", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof UserAlreadyInConversationError) {
            res.status(409).json({ erreur: "L'utilisateur participe déjà à cette conversation" });
        }
        res.status(500).json({ erreur: "Erreur lors de l'ajout d'un participant dans la conversation" });
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
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof ConversationNotFoundError) {
            res.status(404).json({ erreur: "Aucune conversation ayant l'identifiant passé en paramètre a été trouvée" });
        }
        res.status(500).json({ erreur: "Erreur lors de la suppression de la conversation" });
    }
}
