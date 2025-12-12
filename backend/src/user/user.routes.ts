import { Router } from "express";
import * as userController from "./user.controllers";
import { isAuthenticated } from "../auth/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import * as teamController from "../team/team.controllers";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route GET /api/users
 */
router.get("/", userController.getUsersController);

/**
 * @route GET /api/users/me
 */
router.get("/me", userController.getUserByIdController);

/**
 * @route GET /api/users/:id
 */
router.get("/:id", userController.getUserByIdController);

/**
 * @route PATCH /api/users/me
 */
router.patch("/me", userController.updateUserController);

/**
 * @route DELETE /api/users/me
 */
router.delete("/me", userController.deleteUserController);

/**
 * @route GET /api/users/me/teams
 */
router.get("/me/teams", userController.getUserTeamsController);

//TODO
router.get("/me/teams/:id", teamController.getTeamByIdController);

/**
 * @route GET /api/users/me/projects
 */
router.get("/me/projects", userController.getUserProjectsController);

/**
 * @route GET /api/users/me/tasks
 */
router.get("/me/tasks", userController.getUserTasksController);

/**
 * @route GET /api/users/me/notifications
 */
router.get("/me/notifications", userController.getUserNotificationsController);

/**
 * @route GET /api/users/me/conversations
 */
router.get("/me/conversations", userController.getUserConversationsController);

/**
 * @route GET /api/users/me/messages
 */
router.get("/me/messages", userController.getUserMessagesController);

//Toutes les routes suivant nécessitent connecté et admin
router.use(isAdmin);

/**
 * @route PATCH /api/users/:id
 */
router.patch("/:id", userController.updateUserController);

/**
 * @route DELETE /api/users/:id
 */
router.delete("/:id", userController.deleteUserController);

/**
 * @route GET /api/users/:id/teams
 */
router.get("/:id/teams", userController.getUserTeamsController);

/**
 * @route GET /api/users/:id/projects
 */
router.get("/:id/projects", userController.getUserProjectsController);

/**
 * @route GET /api/users/:id/tasks
 */
router.get("/:id/tasks", userController.getUserTasksController);

/**
 * @route GET /api/users/:id/notifications
 */
router.get("/:id/notifications", userController.getUserNotificationsController);

/**
 * @route GET /api/users/:id/conversations
 */
router.get("/:id/conversations", userController.getUserConversationsController);

/**
 * @route GET /api/users/:id/messages
 */
router.get("/:id/messages", userController.getUserMessagesController);

export default router;
