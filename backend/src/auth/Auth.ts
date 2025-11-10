import { z } from "zod";
import { tokenPayloadSchema, loginDataSchema } from "./auth.schemas";

/**
 * Type représentant le payload du token d'authentification
 */
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

/**
 * Type représentant les données attendues lors de la connexion d'un utilisateur
 */
export type LoginData = z.infer<typeof loginDataSchema>;