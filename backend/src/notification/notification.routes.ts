import { Router } from "express";
import * as notificationController from "./notification.controllers";
import { isAuthenticated } from "../auth/auth.middleware";

const router = Router();

//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route POST /api/notifications
 */
router.post("/", notificationController.createNotificationController);

/**
 * @route GET /api/notifications
 */
router.get("/", notificationController.getNotificationsController);

/**
 * @route GET /api/notifications/:id
 */
router.get("/:id", notificationController.getNotificationByIdController);

/**
 * @route PATCH /api/notifications/:id/read
 */
router.patch("/:id/read", notificationController.markNotificationAsReadController);

/**
 * @route DELETE /api/notifications/:id
 */
router.delete("/:id", notificationController.deleteNotificationController);

export default router;