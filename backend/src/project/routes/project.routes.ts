import { Router } from "express";
import * as projectController from "../controllers/project.controllers";

const router = Router();

/**
 * @route POST /api/projects
 */
router.post("/", projectController.createProjectController);

/**
 * @route GET /api/pojects
 */
router.get("/", projectController.getProjectsController);

/**
 * @route GET /api/projects/:id
 */
router.get("/:id", projectController.getProjectByIdController);

/**
 * @route PATCH /api/projects/:id
 */
router.patch("/:id", projectController.updateProjectController);

/**
 * @route DELETE /api/projects/:id
 */
router.delete("/:id", projectController.deleteProjectController);

/**
 * @route POST /api/projects/:id/teams/:teamId
 */
router.post("/:id/teams/:teamId", projectController.addTeamToProjectController);

/**
 * @route GET /api/projects/:id/teams
 */
router.get("/:id/teams", projectController.getProjectTeamsController);

/**
 * @route DELETE /api/projects/:id/teams/:teamId
 */
router.delete("/:id/teams/:teamId", projectController.removeTeamFromProjectController);

/**
 * @route GET /api/projects/:id/members
 */
router.get("/:id/members", projectController.getProjectMembersController);

/**
 * @route GET /api/projects/:id/tasks
 */
router.get("/:id/tasks", projectController.getProjectTasksController);

export default router;