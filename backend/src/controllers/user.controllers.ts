import { Request, Response } from "express";
import {
  updateUserDataSchema,
  searchUsersFilterSchema,
} from "@/schemas/user.schemas";
import { searchTasksFilterSchema } from "@/schemas/task.schemas";
import {
  EmailAlreadyUsedError,
  PhoneNumberAlreadyUsedError,
  UserNotFoundError,
  UsernameAlreadyUsedError,
} from "@/errors/user";
import * as userService from "@/services/user.services";
import { z } from "zod";
import { idParamSchema } from "@/schemas/idparam.schema";
import { searchProjectsFilterSchema } from "@/schemas/project.schemas";
import { searchTeamsFilterSchema } from "@/schemas/team.schemas";
import { searchNotificationsFilterSchema } from "@/schemas/notification.schemas";
import { searchMessagesFilterSchema } from "@/schemas/message.schemas";
import { searchConversationsFilterSchema } from "@/schemas/conversation.schemas";
import { getUserIdFromRequest } from "@/utils/utils";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { redis } from "@/lib/redis/redis";

/**
 * Récupère la liste des utilisateurs repondant à un filtre de recherche (Aucun filtre -> tous)
 * @async
 * @param {Request} req - requête Express contenant les données de filtre à utiliser dans req.query
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<UsersCollection>} - retourne un objet JSON contenant la liste des utilisateurs
 */
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const filter = searchUsersFilterSchema.parse(req.query);
    const userCollection = await userService.getUsers(filter);
    res
      .status(200)
      .json(
        successResponse(
          userCollection.users,
          "Utilisateurs récupérés",
          userCollection.pagination,
        ),
      );
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des utilisateurs",
        ),
      );
  }
};

/**
 * Récupère un utilisateur par son identifiant (id)
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - retourne un objet JSON contenant les informations de l'utilisateur
 */
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const user = await userService.getUserById(id);
    res.status(200).json(successResponse(user, "Utilisateur récupéré"));
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json(errorResponse("INVALID_REQUEST", err.message));
    }

    if (err instanceof UserNotFoundError) {
      return res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_FOUND", err.message),
        );
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération de l'utilisateur",
        ),
      );
  }
};

/**
 * Met à jour les informations de l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 *                      - contient les données à mettre à jour dans req.body
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @returns {Promise<SafeUser>} - l'utilisateur avec les informations mises à jour
 */
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const input = updateUserDataSchema.parse(req.body);
    const user = await userService.updateUser(id, input);
    res
      .status(200)
      .json(successResponse(user, "Utilisateur mis à jour avec succès"));
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json(errorResponse("INVALID_REQUEST", err.message));
    }

    if (err instanceof UserNotFoundError) {
      return res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_FOUND", err.message),
        );
    }

    if (err instanceof EmailAlreadyUsedError) {
      return res
        .status(409)
        .json(
          errorResponse(err.code ? err.code : "EMAIL_CONFLICT", err.message),
        );
    }

    if (err instanceof UsernameAlreadyUsedError) {
      return res
        .status(409)
        .json(
          errorResponse(err.code ? err.code : "USERNAME_CONFLICT", err.message),
        );
    }

    if (err instanceof PhoneNumberAlreadyUsedError) {
      return res
        .status(409)
        .json(
          errorResponse(
            err.code ? err.code : "PHONE_NUMBER_CONFLICT",
            err.message,
          ),
        );
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour de l'utilisateur",
        ),
      );
  }
};

/**
 * Supprime l'utilisateur ayant l'identifiant passé en paramètre
 * @async
 * @param {Request} req - requête Express contenant l'identifiant de l'utilisateur dans req.params.id
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur de la suppression de l'utilisateur", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json(errorResponse("INVALID_REQUEST", err.message));
    }

    if (err instanceof UserNotFoundError) {
      return res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_FOUND", err.message),
        );
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la suppression de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère toutes les équipes dont l'utilisateur est membre
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserTeamsController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchTeamsFilterSchema.parse(req.query);
    const teamCollection = await userService.getUserTeams(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          teamCollection.teams,
          "Équipes de l'utilisateur récupérées",
          teamCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des équipes de l'utilisateur : ",
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
          "Erreur lors de la récupération des équipes de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère tous les coéquipiers d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserPeersController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const users = await userService.getUserPeers(id);
    res
      .status(200)
      .json(successResponse(users, "Coéquipiers de l'utilisateur récupérés"));
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des coéquipiers de l'utilisateur : ",
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
          "Erreur lors de la récupération des coéquipiers de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère tous les projets dans lesquels l'utilisateur intervient
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserProjectsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchProjectsFilterSchema.parse(req.query);
    const projectCollection = await userService.getUserProjects(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          projectCollection.projects,
          "Projets de l'utilisateur récupérés",
          projectCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des projets de l'utilisateur : ",
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
          "Erreur lors de la récupération des projets de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère toutes les tâches assignées à un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserTasksController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchTasksFilterSchema.parse(req.query);
    console.log("==PARAMS==", req.query);
    const userTaskCollection = await userService.getUserTasks(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          userTaskCollection.tasks,
          "Tâches de l'utilisateur récupérées",
          userTaskCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des taches de l'utilisateur : ",
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
          "Erreur lors de la récupération des tâches de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère toutes les notifications d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserNotificationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchNotificationsFilterSchema.parse(req.query);
    const userNotificationCollection = await userService.getUserNotifications(
      id,
      filter,
    );
    res
      .status(200)
      .json(
        successResponse(
          userNotificationCollection.notifications,
          "Notifications de l'utilisateur récupérées",
          userNotificationCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des notifications de l'utilisateur : ",
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
          "Erreur lors de la récupération des notifications de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère le nombre de notifications non lues d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const countUnreadNotificationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const count = await userService.countUnreadNotifications(id);
    res
      .status(200)
      .json(
        successResponse(count, "Nombre de notifications non lues récupéré"),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération du nombre de notifications non lues",
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
          "Erreur lors de la récupération du nombre de notifications non lues",
        ),
      );
  }
};

/**
 * Récupère toutes les conversations d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserConversationsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchConversationsFilterSchema.parse(req.query);
    const userConversationCollection = await userService.getUserConversations(
      id,
      filter,
    );
    res
      .status(200)
      .json(
        successResponse(
          userConversationCollection.conversations,
          "Conversations de l'utilisateur récupérées",
          userConversationCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des conversations de l'utilisateur : ",
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
          "Erreur lors de la récupération des conversations de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère tous les messages d'un utilisateur
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserMessagesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const filter = searchMessagesFilterSchema.parse(req.query);
    const userMessageCollection = await userService.getUserMessages(id, filter);
    res
      .status(200)
      .json(
        successResponse(
          userMessageCollection.messages,
          "Messages de l'utilisateur récupérés",
          userMessageCollection.pagination,
        ),
      );
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des messages de l'utilisateur : ",
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
          "Erreur lors de la récupération des messages de l'utilisateur",
        ),
      );
  }
};

/**
 * Récupère le status de connexion d'un utilisateur (en ligne ou hors ligne)
 * @param {Request} req - requete Express contenant l'identifiant de l'utilisateur
 * @param {Response} res - reponse Express em JSON
 */
export const getUserStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: getUserIdFromRequest(req) });
    const key = `user:${id}:connections`;
    const count = await redis.scard(key);
    const online = count > 0;
    res
      .status(200)
      .json(successResponse(online, "Statut de l'utilisateur récupéré"));
  } catch (err) {
    console.error(
      "Erreur lors de la récupération du status de l'utilisateur : ",
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
          "Erreur lors de la récupération du status de l'utilisateur",
        ),
      );
  }
};
