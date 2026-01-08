import { Router } from "express";
import {
  register,
  login,
  logout,
  updatePasswordController,
  verifyAuth,
} from "./auth.controllers";
import { isAuthenticated } from "./auth.middleware";

const router = Router();

/**
 * @route POST /api/auth/register
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 */
router.post("/login", login);

/**
 * @route POST /api/auth/logout
 */
router.post("/logout", logout);

/**
 * @route GET /api/auth/verify
 */
router.get("/verify", verifyAuth);

/**
 * @route PATCH /api/auth/me/password
 */
router.patch("/me/password", isAuthenticated, updatePasswordController);

export default router;
