import { Router } from "express";
import { googleAuth, googleCallback } from "./googleAuth.controllers";

const router = Router();

/**
 * @route GET /api/auth/google
 * Redirige vers Google
 */
router.get("/google", googleAuth);

/**
 * @route GET /api/auth/google/callback
 * Callback après authentification Google
 */
router.get("/google/callback", googleCallback);

export default router;