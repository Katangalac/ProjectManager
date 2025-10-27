import { z } from "zod";
import { tokenPayloadSchema, loginSchema } from "../validators";

/**
 * Type représentant le payload du token d'authentification
 */
export type TokenPayloadType = z.infer<typeof tokenPayloadSchema>;

/**
 * Type représentant les données attendues lors de la connexion d'un utilisateur
 */
export type LoginInput = z.infer<typeof loginSchema>;