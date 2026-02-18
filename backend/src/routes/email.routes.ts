import * as emailService from "../controllers/email.controllers";
import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

//Les routes suivant nécessitent une connexion
router.use(isAuthenticated);

/**
 * @route POST /api/email/welcome
 */
router.post("/welcome", emailService.sendWelcomeEmail);

export default router;
