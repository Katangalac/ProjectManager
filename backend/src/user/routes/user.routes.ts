import {Router} from "express"
import * as userController from "../controllers/user.controllers.js"

const router = Router();

//GET /api/users
router.get("/", userController.getUsersController);

//GET /api/users/:id
router.get("/:id", userController.getUserByIdController);

//PATCH /api/users/:id
router.patch("/:id", userController.updateUserController);

//DELETE /api/users/:id
router.delete("/:id", userController.deleteUserController);

export default router;