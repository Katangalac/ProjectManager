import * as teamService from "./team.services";
import { Request, Response } from "express";
import * as teamSchemas from "./team.schemas";
import * as teamError from "./errors";
import { success, z } from "zod";
import { idParamSchema } from "../schemas/idparam.schema";
import { searchTasksFilterSchema } from "../task/task.schemas";
import { searchUsersFilterSchema } from "../user/user.schemas";
import { searchProjectsFilterSchema } from "../project/project.schemas";
import { searchConversationsFilterSchema } from "../conversation/conversation.schemas";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { addNotificationToQueue } from "../notification/notification.queue";

/**
 * Crée une nouvelle équipe
 * @async
 * @param {Request} req - requete Express contenant les infos de l'équipe à créer
 * @param {Response} res - reponse Express en JSON
 */
export const createTeamController = async (req: Request, res: Response) => {
  try {
    const teamData = teamSchemas.createTeamSchema.parse(req.body);
    if (!teamData.leaderId && req.user) {
      teamData.leaderId = req.user?.sub;
    }
    const newTeam = await teamService.createTeam(teamData);
    if (req.user) await teamService.addUserToTeam(req.user.sub, newTeam.id, "");
    res.status(201).json(successResponse(newTeam, "Équipe créée"));
  } catch (err) {
    console.error("Erreur lors de la création de l'équipe : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la création de l'équipe"
        )
      );
  }
};

/**
 * Récupère les équipes enregistrées dans le système respectant le filtre passé en paramètre
 * @async
 * @param {Request} req - requete Express
 * @param {Response}  res - reponse Express en JSON
 */
export const getTeamsController = async (req: Request, res: Response) => {
  try {
    const filter = teamSchemas.searchTeamsFilterSchema.parse(req.query);
    const teamsCollection = await teamService.getTeams(filter);
    res
      .status(200)
      .json(
        successResponse(
          teamsCollection.teams,
          "Équipes récupérées",
          teamsCollection.pagination
        )
      );
  } catch (err) {
    console.error("Erreur lors de la récupération des équipes : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des équipes"
        )
      );
  }
};

/**
 * Récupère l'équipe ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const getTeamByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const team = await teamService.getTeamById(id);
    res.status(200).json(successResponse(team, "Équipe récupérée"));
  } catch (err) {
    console.error("Erreur lors de la récupération de l'équipe : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.TeamNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "TEAM_NOT_FOUND", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération de l'équipe"
        )
      );
  }
};

/**
 * Met à jour les informations d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe
 * @param {Response} res - rponse Express en JSON
 */
export const updateTeamController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const teamData = teamSchemas.updateTeamDataSchema.parse(req.body);
    const updatedTeam = await teamService.updateTeam(id, teamData);
    res
      .status(200)
      .json(successResponse(updatedTeam, "Équipe mise à jour avec succès"));
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'équipe : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.TeamNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "TEAM_NOT_FOUND", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour de l'équipe"
        )
      );
  }
};

/**
 * Supprime une équipe
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const deleteTeamController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    await teamService.deleteTeam(id);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur lors de la suppression de l'équipe : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.TeamNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "TEAM_NOT_FOUND", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la suppression de l'équipe"
        )
      );
  }
};

/**
 * Ajoute un utilisateur dans une équipe
 * @async
 * @param {Request} req - requete Express contenant les informations sur l'utilisateur à ajouter et son role dans l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const addUserToTeamController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const inputData = teamSchemas.addUserToTeamInputSchema.parse(req.body);
    const userTeamPair = await teamService.addUserToTeam(
      inputData.userId,
      id,
      inputData.userRole
    );
    res
      .status(200)
      .json(successResponse(userTeamPair, "Utilisateur ajouté à l'équipe"));
    addNotificationToQueue(
      inputData.userId,
      "Nouvelle équipe de travail",
      "Vous avez été ajouté à une équipe"
    );
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'utilisateur à l'équipe : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.UserAlreadyInTeamError) {
      res
        .status(409)
        .json(
          errorResponse(
            err.code ? err.code : "USER_ALREADY_IN_TEAM",
            err.message
          )
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de l'ajout de l'utilisateur à l'équipe"
        )
      );
  }
};

/**
 * Retire un utilisateur d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'identifiant de l'équipe et de l'utilisateur
 * @param {Response} res - reponse Express en JSON
 */
export const removeUserFromTeamController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: teamId } = idParamSchema.parse({ id: req.params.id });
    const { id: userId } = idParamSchema.parse({ id: req.params.userId });
    await teamService.removeUserFromTeam(userId, teamId);
    res.status(204).send();
    addNotificationToQueue(
      userId,
      "Retrait d'un équipe",
      "Vous avez été rétiré d'une équipe"
    );
  } catch (err) {
    console.error(
      "Erreur lors du retrait de l'utilisateur de l'équipe : ",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.UserNotInTeamError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_IN_TEAM", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors du retrait de l'utilisateur de l'équipe"
        )
      );
  }
};

/**
 * Met à jour le role d'un utilisateur au sein d'une équipe
 * @async
 * @param {Request} req - requete Express contenant le nouveau role dans req.body ainsi que les identifiants
 * @param {Response} res - reponse Express en JSON
 */
export const updateUserRoleInTeamController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id: teamId } = idParamSchema.parse({ id: req.params.id });
    const { id: userId } = idParamSchema.parse({ id: req.params.userId });
    const { userRole } = teamSchemas.userTeamRoleSchema.parse(req.body);
    const updatedUserTeamPair = await teamService.updateUserRoleInTeam(
      userId,
      teamId,
      userRole
    );
    res
      .status(200)
      .json(
        successResponse(updatedUserTeamPair, "Rôle de l'utilisateur mis à jour")
      );
    addNotificationToQueue(
      userId,
      "Nouveau rôle",
      "Un nouveau rôle vous a été assigné"
    );
  } catch (err) {
    console.error(
      "Erreur lors de la modification du rôle de l'utilisateur dans l'équipe",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.UserNotInTeamError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_IN_TEAM", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la modification du rôle de l'utilisateur dans l'équipe"
        )
      );
  }
};

/**
 * Récupère les membres d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'id de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const getTeamMembersController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchUsersFilterSchema.parse(req.query);
    const teamMembers = await teamService.getTeamMembers(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          teamMembers.users,
          "Membres de l'équipe récupérés",
          teamMembers.pagination
        )
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des membres de l'équipe : ",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des membres de l'équipe"
        )
      );
  }
};

/**
 * Récupère les projets d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'id de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const getTeamProjectsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchProjectsFilterSchema.parse(req.query);
    const teamProjects = await teamService.getTeamProjects(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          teamProjects.projects,
          "Projets de l'équipe récupérés",
          teamProjects.pagination
        )
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des projets de l'équipe : ",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des projets de l'équipe"
        )
      );
  }
};

/**
 * Récupère les taches d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'id de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const getTeamTasksController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchTasksFilterSchema.parse(req.query);
    const teamTasks = await teamService.getTeamTasks(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          teamTasks.tasks,
          "Tâches de l'équipe récupérées",
          teamTasks.pagination
        )
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des taches de l'équipe : ",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.TeamNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "TEAM_NOT_FOUND", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des taches de l'équipe"
        )
      );
  }
};

/**
 * Récupère les conversations d'une équipe
 * @async
 * @param {Request} req - requete Express contenant l'id de l'équipe
 * @param {Response} res - reponse Express en JSON
 */
export const getTeamConversationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const filter = searchConversationsFilterSchema.parse(req.query);
    const teamConversations = await teamService.getTeamConversations(
      id,
      filter
    );
    res
      .status(200)
      .json(
        successResponse(
          teamConversations.conversations,
          "Tâches de l'équipe récupérées",
          teamConversations.pagination
        )
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des conversation de l'équipe : ",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof teamError.TeamNotFoundError) {
      res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "TEAM_NOT_FOUND", err.message)
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des conversations de l'équipe"
        )
      );
  }
};
