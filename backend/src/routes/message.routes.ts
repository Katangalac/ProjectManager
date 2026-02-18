import * as messageController from "../controllers/message.controllers";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route POST /api/messages
 */
router.post("/", messageController.sendMessageController);

/**
 * @route PATCH /api/messages/:id
 */
router.patch("/:id", messageController.editMessageController);

/**
 * @route PATCH /api/messages/:id/read
 */
router.patch("/:id/read", messageController.markMessageAsReadController);

/**
 * @route DELETE /api/messages/:id
 */
router.delete("/:id", messageController.deleteMessageController);

export default router;
