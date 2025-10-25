import {userSchema, publicUserSchema, updateUserSchema, registerUserSchema, getUsersFilterSchema} from "../validators"
import {z} from "zod";

/**
 * Type représentant les données attendues pour un utilisateur
 */
export type User = z.infer<typeof userSchema>;

/**
 * Type représentant un utilisateur sans ses données sensibles
 */
export type SafeUser = Omit<User, "password">;

/**
 * Type représentant les données publiques attendues pour un utilisateur
 */
export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * Type représentant les données attendues lors de la création d'un utilisateur
 */
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

/**
 * Type représentant les données attendues lors de la modification d'un utilisateur
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Type représentant les champs pouvant être utilisés comme filtre de recherche des utilisateurs
 */
export type GetUsersFilters = z.infer<typeof getUsersFilterSchema>;


