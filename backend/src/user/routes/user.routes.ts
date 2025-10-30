import {Router} from "express"
import * as userController from "../controllers/user.controllers.js"

const router = Router();

/**
 * @route GET /api/users 
 */
router.get("/", userController.getUsersController);

/**
 * @route GET /api/users/:id
 */
router.get("/:id", userController.getUserByIdController);

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
router.get("/:id/teams", userController.getUserTeamsController)

export default router;