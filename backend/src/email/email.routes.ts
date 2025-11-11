import * as emailService from "./email.controllers";
import { Router } from "express";
import { isAuthenticated } from "../auth/auth.middleware";

const router = Router();

//Les routes suivant nécessitent une connexion
router.use(isAuthenticated);

/**
 * @route POST /api/email/welcome
 */
router.post("/welcome", emailService.sendWelcomeEmail);

export default router;