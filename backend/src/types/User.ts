import {
  userSchema,
  publicUserSchema,
  updateUserDataSchema,
  createUserSchema,
  searchUsersFilterSchema,
} from "@/schemas/user.schemas";
import { z } from "zod";
import { Pagination } from "@/types/Pagination";

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
export type CreateUserData = z.infer<typeof createUserSchema>;

/**
 * Type représentant les données attendues lors de la modification d'un utilisateur
 */
export type UpdateUserData = z.infer<typeof updateUserDataSchema>;

/**
 * Type représentant les champs pouvant être utilisés comme filtre de recherche des utilisateurs
 */
export type SearchUsersFilter = z.infer<typeof searchUsersFilterSchema>;

/**
 * Type représentant une liste des utilisateurs ainsi que les informations sur la pagination
 */
export type UsersCollection = {
  users: SafeUser[];
  pagination: Pagination;
};
