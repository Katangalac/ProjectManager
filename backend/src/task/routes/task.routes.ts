import { Router } from "express";
import * as taskController from "../controllers/task.controllers";

const router = Router();

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
router.post("/:id/contributors/:userId", taskController.unassignUserFromTaskController);

export default router;

