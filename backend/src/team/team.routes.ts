import { Router } from "express";
import * as teamController from "./team.controllers";
import { isAuthenticated } from "../auth/auth.middleware";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route POST /api/teams
 */
router.post("/", teamController.createTeamController);

/**
 * @route GET /api/teams
 */
router.get("/", teamController.getTeamsController);

/**
 * @route GET /api/teams/:id
 */
router.get("/:id", teamController.getTeamByIdController);

/**
 * @route PATCH /api/teams/:id
 */
router.patch("/:id", teamController.updateTeamController);

/**
 * @route DELETE /api/teams/:id
 */
router.delete("/:id", teamController.deleteTeamController);

/**
 * @route GET /api/teams/:id/members
 */
router.get("/:id/members", teamController.getTeamMembersController);

/**
 * @route POST /api/teams/:id/members
 */
router.post("/:id/members", teamController.addUserToTeamController);

/**
 * @route PATCH /api/teams/:id/members/:userId
 */
router.patch(
  "/:id/members/:userId",
  teamController.updateUserRoleInTeamController
);

/**
 * @route DELETE /api/teams/:id/members/:userId
 */
router.delete(
  "/:id/members/:userId",
  teamController.removeUserFromTeamController
);

/**
 * @route GET /api/teams/:id/projects
 */
router.get("/:id/projects", teamController.getTeamProjectsController);

/**
 * @route GET/api/teams/:id/tasks
 */
router.get("/:id/tasks", teamController.getTeamTasksController);

/**
 * @route GET/api/teams/:id/conversations
 */
router.get("/:id/conversations", teamController.getTeamConversationsController);

/**
 * @route GET /api/teams/:id/invitations
 */
router.get("/:id/invitations", teamController.getTeamInvitationsController);

export default router;
