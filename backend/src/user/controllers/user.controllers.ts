import { Request, Response } from "express";
import { updateUserSchema, getUsersFilterSchema } from "../validators/index.js";
import{EmailAlreadyUsedError,PhoneNumberAlreadyUsedError,UserNotFoundError,UsernameAlreadyUsedError} from "../errors/index.js"
import * as userService from "../services/user.services.js"
import { z } from "zod"

/**
 * Schéma pour valider l'id passé en paramètre
 * S'assure que l'id est un uuid 
 */
const idParamSchema = z.object({
  id: z.uuid("ID invalide"),
});

/**
 * Récupère la liste des utilisateurs repondant à un filtre de recherche (Aucun filtre -> tous)
 * @async
 * @param {Request} req : requête Express contenant les données de filtre à utiliser dans req.query
 * @param {Response} res : réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - retourne un objet JSON contenant la liste des utilisateurs
 */
export const getUsersController = async(req: Request, res: Response) => {
    try {
        const filters = getUsersFilterSchema.parse(req.query);
        const users = await userService.getUsers(filters);
        res.status(200).json(users);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

/**
 * Récupère un utilisateur par son identifiant (id)
 * @async
 * @param {Request} req : requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res : réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - retourne un objet JSON contenant les informations de l'utilisateur
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
};

/**
 * Met à jour les informations de l'utilisateur ayant l'identifiant passé en paramètre 
 * @async
 * @param {Request} req : - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 *                        - contient les données à mettre à jour dans req.body
 * @param {Response} res : réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} : l'utilisateur avec les informations mises à jour
 */
export const updateUserController = async(req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
        const input = updateUserSchema.parse(req.body);
        const user = await userService.updateUser(id, input);
        res.status(200).json({message:"Utilisateur mis à jour avec succès", user});
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        if (err instanceof EmailAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        if (err instanceof UsernameAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        if (err instanceof PhoneNumberAlreadyUsedError) {
            return res.status(409).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};

/**
 * Supprime l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req : requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res : réponse Express utilisé pour renvoyer la réponse JSON
 */
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({id:req.params.id});
       /*  const id = req.params.id;
        if (!id) return res.status(401).json({ message: "Requête invalide. Id manquant" }); */
        await userService.deleteUser(id);
        res.status(204).send();
    }
    catch (err) {
        console.error("Erreur de la suppression de l'utilisateur", err);
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: err.message });
        }

        if (err instanceof UserNotFoundError) {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: "Erreur de la suppression de l'utilisateur" });
    }
};

/**
 * Récupère toutes les équipes dont l'utilisateur est membre
 * @param {Request} req : requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res : reponse Express em JSON
 */
export const getUserTeamsController = async (req:Request, res:Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const teams = await userService.getUserTeams(id);
        res.status(200).json(teams);
    } catch (err) {
        console.error("Erreur lors de la récupération des équipes de l'utilisateur : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des équipes de l'utilisateur" });
    }
}

