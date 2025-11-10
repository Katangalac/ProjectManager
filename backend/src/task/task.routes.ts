import { Router } from "express";
import * as taskController from "./task.controllers";
import { isAuthenticated } from "../auth/auth.middleware";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route POST /api/tasks
 */
router.post("/", taskController.createTaskController);

/**
 * @route GET /api/tasks
 */
router.get("/", taskController.getTasksController);

/**
 * @route GET /api/tasks/:id
 */
router.get("/:id", taskController.getTaskByIdController);

/**
 * @route PATCH /api/tasks/:id
 */
router.patch("/:id", taskController.updateTaskController);

/**
 * @route PATCH /api/tasks/:id/status
 */
router.patch("/:id/status", taskController.updateTaskStatusController);

/**
 * @route DELETE /api/tasks/:id
 */
router.delete("/:id", taskController.deleteTaskController);

/**
 * @route GET /api/teams/:id/contributors
 */
router.get("/:id/contributors", taskController.getTaskContributorsController);

/**
 * @route POST /api/tasks/:id/contributors/:userId
 */
router.post("/:id/contributors/:userId", taskController.assignTaskToUserController);

/**
 * @route DELETE /api/tasks/:id/contributors/:userId
 */
router.delete("/:id/contributors/:userId", taskController.unassignUserFromTaskController);

export default router;

