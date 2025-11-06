import * as conversationController from "../controllers/conversation.controllers";
import { Router } from "express";

const router = Router();

/**
 * @route POST /api/conversations
 */
router.post("/", conversationController.createConversationController);

/**
 * @route GET /api/conversations/:id
 */
router.get("/:id", conversationController.getConversationByIdController);

/**
 * @route POST /api/conversations/:id/participants/:userId
 */
router.post("/:id/participants/:userId", conversationController.addParticipantToConversationController);

/**
 * @route GET /api/conversations/:id/participants
 */
router.get("/:id/participants", conversationController.getConversationsParticipantsController);

/**
 * @route GET /api/conversations/:id/messages
 */
router.get("/:id/messages", conversationController.getConversationMessagesController);

/**
 * @route PATCH /api/conversations/:id
 */
router.patch("/:id", conversationController.updateConversationController);

/**
 * @route DELETE /api/conversations/:id
 */
router.delete("/:id", conversationController.deleteConversationController)

export default router;