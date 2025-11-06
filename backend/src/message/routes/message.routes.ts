import * as messageController from "../controllers/message.controllers";
import { Router } from "express";

const router = Router();

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