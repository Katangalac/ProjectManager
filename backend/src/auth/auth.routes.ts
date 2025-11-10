import { Router } from "express";
import { register, login, logout } from "./auth.controllers";

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

export default router;