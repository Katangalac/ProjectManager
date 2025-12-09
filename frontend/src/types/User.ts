/**
 * Type représentant un utilisateur
 */
export type User = {
  id: string;
  userName: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  profession: string | null;
  imageUrl: string | null;
  role: "ADMIN" | "USER";
  provider: "LOCAL" | "GOOGLE";
  oauthId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Type des données attendues lors de la création d'un utilisateur
 */
export type CreateUserData = {
  userName: string;
  email: string;
  password: string | null;
};

/**
 * Type des données attendues lors de la modification d'un utilisateur
 */
export type UpdateUserData = {
  userName?: string | undefined;
  email?: string | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  profession?: string | null | undefined;
  imageUrl?: string | null | undefined;
};

/**
 * Type des données attendues comme paramètre de recherche des utilisateurs
 */
export type SearchUsersFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  email?: string | undefined;
  userName?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  profession?: string | undefined;
  all?: boolean | undefined;
};
