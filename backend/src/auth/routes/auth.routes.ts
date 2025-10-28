import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controllers";

const router = Router();

/**
 * @route POST /register 
 */ 
router.post("/register", register);

/**
 * @route POST /login 
 */ 
router.post("/login", login);

/**
 * @route POST /logout 
 */ 
router.post("/logout", logout);

export default router;