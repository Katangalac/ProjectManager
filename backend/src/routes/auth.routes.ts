import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  logout,
  updatePasswordController,
  verifyAuth,
  forgotPassword,
  validateResetToken,
  resetPassword,
  exchangeAuthCodeController,
} from "../controllers/auth.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives de connexion, réessayez plus tard.",
});

/**
 * @route POST /api/auth/register
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 */
router.post("/login", loginLimiter, login);

/**
 * @route POST /api/auth/logout
 */
router.post("/logout", logout);

/**
 * @route POST /api/auth/exchange
 */
router.post("/exchange", exchangeAuthCodeController);
/**
 * @route GET /api/auth/verify
 */
router.get("/verify", verifyAuth);

/**
 * @route POST "api/auth/forgot-password"
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route POST "api/auth/validate-reset-token"
 */
router.post("/validate-reset-token", validateResetToken);

/**
 * @route POST "api/auth/reset-password"
 */
router.post("/reset-password", resetPassword);

/**
 * @route PATCH /api/auth/me/password
 */
router.patch("/me/password", isAuthenticated, updatePasswordController);

export default router;
