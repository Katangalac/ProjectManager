import {Router} from "express"
import * as userController from "../controllers/user.controllers.js"

const router = Router();

/**
 * @route GET /users 
 */
router.get("/", userController.getUsersController);

/**
 * @route GET /users/:id
 */
router.get("/:id", userController.getUserByIdController);

/**
 * @route PATCH /users/:id
 */
router.patch("/:id", userController.updateUserController);

/**
 * @route DELETE /users/:id
 */ 
router.delete("/:id", userController.deleteUserController);

export default router;