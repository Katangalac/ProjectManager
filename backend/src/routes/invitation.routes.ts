import { Router } from "express";
import * as invitationController from "../controllers/invitation.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route POST /api/invitations
 */
router.post("/", invitationController.createInvitationController);

/**
 * @route GET /api/invitations
 */
router.get("/", invitationController.getInvitationsController);

/**
 * @route GET /api/invitations/:id
 */
router.get("/:id", invitationController.getInvitationByIdController);

/**
 * @route POST /api/invitations/:id/accept
 */
router.post("/:id/accept", invitationController.acceptInvitationController);

/**
 * @route POST /api/invitations/:id/reject
 */
router.post("/:id/reject", invitationController.rejectInvitationController);

/**
 * @route DELETE /api/invitations/:id
 */
router.delete("/:id", invitationController.deleteInvitationController);

export default router;
