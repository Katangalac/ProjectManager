import * as projectService from "@/services/project.services";
import { Request, Response } from "express";
import * as projectSchemas from "@/schemas/project.schemas";
import * as projectError from "@/errors/project";
import { idParamSchema } from "@/schemas/idparam.schema";
import { z } from "zod";
import { searchUsersFilterSchema } from "@/schemas/user.schemas";
import { searchTasksFilterSchema } from "@/schemas/task.schemas";
import { searchTeamsFilterSchema } from "@/schemas/team.schemas";
import { ProjectStatus } from "@prisma/client";
import { successResponse, errorResponse } from "@/utils/apiResponse";

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
    res.status(201).json(successResponse(newProject, "Projet créé"));
  } catch (err) {
    console.error("Erreur lors de la création du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la création du projet",
        ),
      );
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
    const projectsCollection = await projectService.getProjects(filter);
    res
      .status(200)
      .json(successResponse(projectsCollection, "Projets récupérés"));
  } catch (err) {
    console.error("Erreur lors de la récupération des projets : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des projets",
        ),
      );
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
    res.status(200).json(successResponse(project, "Projet récupéré"));
  } catch (err) {
    console.error("Erreur lors de la récupération du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.ProjectNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "PROJECT_NOT_FOUND", err.message),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération du projet",
        ),
      );
  }
};

/**
 * Calcul le cout total d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectTotalCostController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const totalCost = await projectService.getProjectTotalCost(id);
    res
      .status(200)
      .json(successResponse(totalCost, "Cout total du projet récupéré"));
  } catch (err) {
    console.error("Erreur lors du calcul du cout total du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors du calcul du cout total du projet",
        ),
      );
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
    res
      .status(200)
      .json(successResponse(updatedProject, "Projet mis à jour avec succès"));
  } catch (err) {
    console.error("Erreur lors de la mise à jour du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.ProjectNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "PROJECT_NOT_FOUND", err.message),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour du projet",
        ),
      );
  }
};

/**
 * Met à jour le status d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant du projet
 * @param {Response} res - rponse Express en JSON
 */
export const updateProjectStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const newStatus = z.enum(ProjectStatus).parse(req.body);
    const updatedProject = await projectService.updateProject(id, {
      status: newStatus,
    });
    res
      .status(200)
      .json(
        successResponse(
          updatedProject,
          "Status du projet mis à jour avec succès",
        ),
      );
  } catch (err) {
    console.error("Erreur lors de la mise à jour du status du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.ProjectNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "PROJECT_NOT_FOUND", err.message),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour du status du projet",
        ),
      );
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
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.ProjectNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "PROJECT_NOT_FOUND", err.message),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la suppression du projet",
        ),
      );
  }
};

/**
 * Ajoute une équipe dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe et du projet
 * @param {Response} res - reponse Express en JSON
 */
export const addTeamToProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id: projectId } = idParamSchema.parse({ id: req.params.id });
    const { id: teamId } = idParamSchema.parse({ id: req.params.teamId });
    const projectTeamPair = await projectService.addTeamToProject(
      teamId,
      projectId,
    );
    res
      .status(200)
      .json(successResponse(projectTeamPair, "Équipe ajoutée au projet"));
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'équipe au projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.TeamAlreadyInProjectError) {
      res
        .status(409)
        .json(
          errorResponse(
            err.code ? err.code : "TEAM_ALREADY_IN_PROJECT",
            err.message,
          ),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de l'ajout de l'équipe au projet",
        ),
      );
  }
};

/**
 * Retire une équipe d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe et du projet
 * @param {Response} res - reponse Express en JSON
 */
export const removeTeamFromProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id: projectId } = idParamSchema.parse({ id: req.params.id });
    const { id: teamId } = idParamSchema.parse({ id: req.params.teamId });
    await projectService.removeTeamFromProject(teamId, projectId);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur lors du retrait de l'équipe du projet : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.TeamNotInProjectError) {
      res
        .status(404)
        .json(
          errorResponse(
            err.code ? err.code : "TEAM_NOT_IN_PROJECT",
            err.message,
          ),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors du retrait de l'équipe du projet",
        ),
      );
  }
};

/**
 * Récupère les équipes impliquées dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectTeamsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchTeamsFilterSchema.parse(req.query);
    const projectTeams = await projectService.getProjectTeams(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          projectTeams.teams,
          "Équipes du projets récupérées",
          projectTeams.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des équipes du projet : ",
      err,
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des équipes du projet",
        ),
      );
  }
};

/**
 * Récupère les utilisateurs impliqués dans un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectCollaboratorsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchUsersFilterSchema.parse(req.query);
    const projectCollaborators = await projectService.getProjectCollaborators(
      id,
      filter,
    );
    res
      .status(200)
      .json(
        successResponse(
          projectCollaborators.users,
          "Membres du projet récupérés",
          projectCollaborators.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des membres du projet : ",
      err,
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des membres du projet",
        ),
      );
  }
};

/**
 * Récupère les taches d'un projet
 * @async
 * @param {Request} req - requete Express contenant l'id du projet
 * @param {Response} res - reponse Express en JSON
 */
export const getProjectTasksController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchTasksFilterSchema.parse(req.query);
    const projectTasks = await projectService.getProjectTasks(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          projectTasks.tasks,
          "Tâches du projet récupérées",
          projectTasks.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des taches du projet : ",
      err,
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof projectError.ProjectNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "PROJECT_NOT_FOUND", err.message),
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des taches du projet",
        ),
      );
  }
};
