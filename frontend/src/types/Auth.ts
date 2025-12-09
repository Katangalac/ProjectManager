import { loginSchema, registerSchema } from "../schemas/auth.schemas.ts";
import { z } from "zod";

/**
 * Type de données attendues lors d'une connexion
 */
export type LoginInputs = z.infer<typeof loginSchema>;

/**
 * Type de données attendues lors d'une inscription
 */
export type RegisterInputs = z.infer<typeof registerSchema>;

/**
 * Type de données attendues lors d'une modification de mot de passe
 */
export type updatePasswordData = {
  currentPassword: string;
  newPassword: string;
};
