import * as projectService from "./project.services";
import { Request, Response } from "express";
import * as projectSchemas from "./project.schemas";
import * as projectError from "./errors";
import { idParamSchema } from "../schemas/idparam.schema";
import { z } from "zod";
import { searchUsersFilterSchema } from "../user/user.schemas";
import { searchTasksFilterSchema } from "../task/task.schemas";
import { searchTeamsFilterSchema } from "../team/team.schemas";

/**
 * Crée un nouveau projet
 * @async
 * @param {Request} req - requete Express contenant les infos de l'équipe à créer
 * @param {Response} res - reponse Express en JSON
 */
export const createProjectController = async (req: Request, res: Response) => {
    try {
        const projectData = projectSchemas.createProjectSchema.parse(req.body);
        if (!projectData.creatorId && req.user) {
            projectData.creatorId = req.user?.sub;
        }
        const newProject = await projectService.createProject(projectData);
        res.status(201).json({ message: "Projet créé", newProject: newProject });
    } catch (err) {
        console.error("Erreur lors de la création du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la création du projet" });
    }
};

/**
 * Récupère les projets enregistrées dans le système respectant le filtre passé en paramètre
 * @async
 * @param {Request} req - requete Express 
 * @param {Response}  res - reponse Express en JSON
 */
export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const filter = projectSchemas.searchProjectsFilterSchema.parse(req.query);
        const projects = await projectService.getProjects(filter);
        res.status(200).json(projects);
    }catch (err) {
        console.error("Erreur lors de la récupération des projets : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des projets" });
    }
};

/**
 * Récupère le projet ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const project = await projectService.getProjectById(id);
        res.status(200).json(project);
    } catch (err) {
        console.error("Erreur lors de la récupération du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.ProjectNotFoundError) {
            res.status(404).json({ error: "Aucun projet correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération du projet" });
    }
};

/**
 * Met à jour les informations d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant du projet
 * @param {Response} res - rponse Express en JSON
 */
export const updateProjectController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const projectData = projectSchemas.updateProjectDataSchema.parse(req.body);
        const updatedProject = await projectService.updateProject(id, projectData);
        res.status(200).json({ message: "Projet mis à jour avec succès", updatedProject: updatedProject });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.ProjectNotFoundError) {
            res.status(404).json({ error: "Aucun projet correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la mise à jour du projet" });
    }
};

/**
 * Supprime un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant du projet
 * @param {Response} res - reponse Express en JSON
 */
export const deleteProjectController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        await projectService.deleteProject(id);
        res.status(204).send();
    } catch (err) {
        console.error("Erreur lors de la suppression du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.ProjectNotFoundError) {
            res.status(404).json({ error: "Aucun projet correspond à l'idetifiant donné" });
        }
        res.status(500).json({ error: "Erreur lors de la suppression du projet" });
    }
};

/**
 * Ajoute une équipe dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe et du projet
 * @param {Response} res - reponse Express en JSON
 */
export const addTeamToProjectController = async (req: Request, res: Response) => {
    try {
        const { id:projectId } = idParamSchema.parse({ id: req.params.id });
        const {id:teamId} = idParamSchema.parse({ id: req.params.teamId });
        const projectTeamPair = await projectService.addTeamToProject(teamId, projectId);
        res.status(200).json({ message: "Équipe ajoutée au projet", projectTeamPair: projectTeamPair });
    }catch (err) {
        console.error("Erreur lors de l'ajout de l'équipe au projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.TeamAlreadyInProjectError) {
            res.status(409).json({ error: "L'équipe est déjà intégrée à ce projet" });
        }
        res.status(500).json({ error: "Erreur lors de l'ajout de l'équipe au projet" });
    }
};

/**
 * Retire une équipe d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe et du projet
 * @param {Response} res - reponse Express en JSON
 */
export const removeTeamFromProjectController = async (req: Request, res: Response) => {
    try {
        const { id:projectId } = idParamSchema.parse({ id: req.params.id });
        const { id:teamId } = idParamSchema.parse({ id: req.params.teamId });
        await projectService.removeTeamFromProject(teamId, projectId);
        res.status(204).send();
    }catch (err) {
        console.error("Erreur lors du retrait de l'équipe du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.TeamNotInProjectError) {
            res.status(409).json({ error: "L'équipe n'est pas impliquée dans ce projet" });
        }
        res.status(500).json({ error: "Erreur lors du retrait de l'équipe du projet" });
    }
};

/**
 * Récupère les équipes impliquées dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectTeamsController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchTeamsFilterSchema.parse(req.query);
        const projectTeams = await projectService.getProjectTeams(id, filter);
        res.status(200).json(projectTeams);
    } catch (err) {
        console.error("Erreur lors de la récupération des équipes du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des équipes du projet" });
    }
}; 


/**
 * Récupère les utilisateurs impliqués dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectMembersController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchUsersFilterSchema.parse(req.query);
        const projectMembers = await projectService.getProjectMembers(id, filter);
        res.status(200).json(projectMembers);
    } catch (err) {
        console.error("Erreur lors de la récupération des membres du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des membres du projet" });
    }
}; 

/**
 * Récupère les taches d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectTasksController = async (req: Request, res: Response) => {
    try {
        const { id } = idParamSchema.parse({ id: req.params.id });
        const filter = searchTasksFilterSchema.parse(req.query);
        const projectTasks = await projectService.getProjectTasks(id, filter);
        res.status(200).json(projectTasks);
    } catch (err) {
        console.error("Erreur lors de la récupération des taches du projet : ", err);
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: "Données invalides" });
        }
        if (err instanceof projectError.ProjectNotFoundError) {
            res.status(404).json({ error: "Aucun projet avec l'identifiant donné n'a été trouvé" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération des taches du projet" });
    }
};