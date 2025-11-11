import { Router } from "express";
import { register, login, logout, updatePasswordController } from "./auth.controllers";
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


//Toutes les routes suivant nécessitent d'être connecté
router.use(isAuthenticated);

/**
 * @route PATCH /api/auth/password
 */
router.patch("/password", updatePasswordController)

export default router;