import * as teamService from "../services/team.services"
import { Request, Response } from "express"
import * as teamSchemaValidator from "../validators"
import * as teamError from "../errors"
import { z } from "zod"

/**
 * Schéma pour valider l'id passé en paramètre
 * S'assure que l'id est un uuid 
 */
const idParamSchema = z.object({
  id: z.uuid("ID invalide"),
});

/**
 * Schéma pour valider les données d'entrée d'une paire utilisateur-équipe
 */
const addUserToTeamInputSchema = teamSchemaValidator.userTeamSchema.omit({
    teamId:true,
    createdAt: true,
    updatedAt: true
});

/**
 * Schéma pour le rôle de l'utilisateur dans une équipe
 */
const userTeamRoleSchema = z.object({
    userRole: z.string()
});

/**
 * Crée une nouvelle équipe
 * @async
 * @param {Request} req : requete Express contenant les infos de l'équipe à créer
 * @param {Response} res : reponse Express en JSON
 */
export const createTeamController = async (req: Request, res: Response) => {
    try {
        const teamData = teamSchemaValidator.teamDataSchema.parse(req.body);
        if (!teamData.leaderId && req.user) {
            teamData.leaderId = req.user?.sub;
        }
        const newTeam = await teamService.createTeam(teamData);
        if(req.user)await teamService.addUserToTeam(req.user.sub, newTeam.id, "");
        res.status(201).json({ message: "Équipe créée", newTeam });
    } catch (err) {
        console.error("Erreur lors de la création de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la création de l'équipe" });
    }
};

/**
 * Récupère les équipes enregistrées dans le système
 * @async
 * @param {Request} req : requete Express 
 * @param {Response}  res : reponse Express en JSON
 */
export const getTeamsController = async (req: Request, res: Response) => {
    try {
        const teams = await teamService.getTeams();
        res.status(200).json(teams);
    }catch (err) {
        console.error("Erreur lors de la récupération des équipes : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des équipes" });
    }
};

/**
 * Récupère l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req : requete Express contenant l'identifiant de l'équipe
 * @param {Response} res : reponse Express en JSON
 */
export const getTeamByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const team = await teamService.getTeamById(id);
        res.status(200).json(team);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.TeamNotFoundError) {
            res.status(404).json({ error: "Aucune équipe correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération de l'équipe" });
    }
};

/**
 * Met à jour les informations d'une équipe
 * @async
 * @param {Request} req : requete Express contenant l'identifiant de l'équipe
 * @param {Response} res : rponse Express en JSON
 */
export const updateTeamController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const teamData = teamSchemaValidator.updateTeamDataSchema.parse(req.body);
        const updatedTeam = await teamService.updateTeam(id, teamData);
        res.status(200).json({ message: "Équipe mise à jour avec succès", updatedTeam });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.TeamNotFoundError) {
            res.status(404).json({ error: "Aucune équipe correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'équipe" });
    }
};

/**
 * Supprime une équipe
 * @async
 * @param {Request} req : requete Express contenant l'identifiant de l'équipe
 * @param {Response} res : reponse Express en JSON
 */
export const deleteTeamController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        await teamService.deleteTeam(id);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.TeamNotFoundError) {
            res.status(404).json({ error: "Aucune équipe correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la suppression de l'équipe" });
    }
};

/**
 * Ajoute un utilisateur dans une équipe
 * @async
 * @param {Request} req : requete Express contenant les informations sur l'utilisateur à ajouter et son role dans l'équipe
 * @param {Response} res : reponse Express en JSON
 */
export const addUserToTeamController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const inputData = addUserToTeamInputSchema.parse(req.body);
        const userTeamPair = await teamService.addUserToTeam(inputData.userId, id, inputData.userRole);
        res.status(200).json({ message: "Utilisateur ajouté à l'équipe", userTeamPair });
    }catch (err) {
        console.error("Erreur lors de l'ajout de l'utilisateur à l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.UserAlreadyInTeamError) {
            res.status(409).json({ error: "L'utilisateur est déjà membre de cette équipe" });
        }
        res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur à l'équipe" });
    }
};

/**
 * Retire un utilisateur d'une équipe
 * @async
 * @param {Request} req : requete Express contenant l'identifiant de l'équipe et de l'utilisateur
 * @param {Response} res : reponse Express en JSON
 */
export const removeUserFromTeamController = async (req: Request, res: Response) => {
    try {
        const { id:teamId } = idParamSchema.parse({ id: req.params.id });
        const { id:userId } = idParamSchema.parse({ id: req.params.userId });
        await teamService.removeUserFromTeam(userId, teamId);
        res.status(204).send();
    }catch (err) {
        console.error("Erreur lors du retrait de l'utilisateur de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.UserNotInTeamError) {
            res.status(409).json({ error: "L'utilisateur n'est pas membre de cette équipe" });
        }
        res.status(500).json({ error: "Erreur lors du retrait de l'utilisateur de l'équipe" });
    }
};

/**
 * Met à jour le role d'un utilisateur au sein d'une équipe
 * @async
 * @param {Request} req : requete Express contenant le nouveau role dans req.body ainsi que les identifiants
 * @param {Response} res : reponse Express en JSON
 */
export const updateUserRoleInTeamController = async (req: Request, res: Response) => {
    try {
        const { id: teamId } = idParamSchema.parse({ id: req.params.id });
        const { id:userId } = idParamSchema.parse({ id: req.params.userId });
        const {userRole} = userTeamRoleSchema.parse(req.body);
        const updatedUserTeamPair = await teamService.updateUserRoleInTeam(userId, teamId, userRole);
        res.status(200).json({ message: "Rôle de l'utilisateur mis à jour", updatedUserTeamPair });
    } catch (err) {
        console.error("Erreur lors de la modification du rôle de l'utilisateur dans l'équipe", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof teamError.UserNotInTeamError) {
            res.status(409).json({ error: "L'utilisateur n'est pas membre de cette équipe" });
        }
        res.status(500).json({ error: "Erreur lors de la modification du rôle de l'utilisateur dans l'équipe" });
    }
};

/**
 * Récupère les membres d'une équipe
 * @async
 * @param {Request} req : requete Express contenant l'id de l'équipe
 * @param {Response} res : reponse Express en JSON
 */
export const getTeamMembers = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const teamMembers = await teamService.getTeamMembers(id);
        res.status(200).json(teamMembers);
    } catch (err) {
        console.error("Erreur lors de la récupération des membres de l'équipe : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors e la récupération des membres de l'équipe" });
    }
};