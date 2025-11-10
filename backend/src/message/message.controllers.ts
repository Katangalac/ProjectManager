import { createMessageSchema, editMessageSchema } from "./message.schemas";
import { idParamSchema } from "../schemas/idparam.schema";
import { MessageNotFoundError, NotUserMessageError } from "./errors";
import { z } from "zod";
import { Request, Response } from "express";
import * as messageService from "./message.services";

/**
 * Crée et envoi un nouveau message
 * @async
 * @param {Request} req - requête Express contenant les informations sur le message à créer
 * @param {Response} res - réponse Express en JSON
 */
export const sendMessageController = async (req: Request, res: Response) => {
    try {
        const messageData = createMessageSchema.parse(req.body);
        const message = await messageService.sendMessage(messageData);
        res.status(201).json({ message: "Message créé et envoyé avec succès", newMessage: message });
    } catch (err) {
        console.error("Erreur lors de l'envoi du message", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        res.status(500).json({ erreur: "Erreur lors de l'envoi du message" });
    }
};

/**
 * Modifie un message
 * @async
 * @param {Request} req - requête Express contenant l'identifiant du message et du modificateur
 * @param {Response} res - réponse Express en JSON
 */
export const editMessageController = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = idParamSchema.parse({id:req.params.id});
        const updateData = editMessageSchema.parse(req.body);
        const editedMessage = await messageService.editMessage(messageId, updateData);
        res.status(200).json({ message: "Message modifié avec succès", editedMessage: editedMessage });
    } catch (err) {
        console.error("Erreur lors de la modification du message", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof MessageNotFoundError) {
            res.status(404).json({ erreur: "Aucun message ayant l'identifiant passé en paramètre a été trouvé" });
        }
        if (err instanceof NotUserMessageError) {
            res.status(401).json({ erreur: "L'utilisateur n'est pas autorisé à modifier ce message car il ne lui appartient pas" });
        }
        res.status(500).json({ erreur: "Erreur lors de la modification du message" });
    }
};

/**
 * Marque un message comme lu
 * @async
 * @param {Request} req - requête Express contenant l'identifiant du message 
 * @param {Response} res - réponse Express en JSON
 */
export const markMessageAsReadController = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = idParamSchema.parse({id:req.params.id});
        const {id:userId} = idParamSchema.parse(req.body);
        const updatedMessage = await messageService.markMessageAsRead(messageId, userId);
        res.status(200).json({message:"Message marqué comme lu", updatedMessage:updatedMessage});
    } catch (err) {
        console.error("Erreur lors de la mise à jour du message", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof MessageNotFoundError) {
            res.status(404).json({ erreur: "Aucun message ayant l'identifiant passé en paramètre a été trouvé" });
        }
        res.status(500).json({ erreur: "Erreur lors de la mise à jour du message" });
    }
};

/**
 * Supprime un message
 * @async
 * @param {Request} req - requête Express contenant l'identifiant du message et du modificateur
 * @param {Response} res - réponse Express en JSON
 */
export const deleteMessageController = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = idParamSchema.parse({id:req.params.id});
        const {id:userId} = idParamSchema.parse(req.body);
        await messageService.deleteMessage(messageId, userId);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression du message", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ erreur: "Données invalides" });
        }
        if (err instanceof MessageNotFoundError) {
            res.status(404).json({ erreur: "Aucun message ayant l'identifiant passé en paramètre a été trouvé" });
        }
        if (err instanceof NotUserMessageError) {
            res.status(401).json({ erreur: "L'utilisateur n'est pas autorisé à supprimer ce message car il ne lui appartient pas" });
        }
        res.status(500).json({ erreur: "Erreur lors de la suppression du message" });
    }
};