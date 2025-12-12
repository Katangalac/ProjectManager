import { User } from "./User";

/**
 * Type représentant une équipe
 */
export type Team = {
  id: string;
  leaderId: string | null;
  name: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
};

/**
 * Type représentant une équipe avec ses relations
 */
export type TeamWithRelations = Team & {
  user?: User | null;
  teamUsers?: {
    teamId: string;
    userId: string;
    userRole: string;
    user: User;
  }[];
};

/**
 * Type des données attendues lors de la création d'une équipe
 */
export type CreateTeamData = {
  leaderId: string | null;
  name: string;
  description: string;
};

/**
 * Type des données attendues lors de la modification d'une équipe
 */
export type UpdateTeamData = {
  leaderId?: string | null | undefined;
  name?: string | undefined;
  description?: string | undefined;
};

/**
 * Type des données attendues comme paramètre de recherche des équipes
 */
export type SearchTeamsFilter = {
  page?: number | undefined;
  pageSize?: number | undefined;
  name?: string | undefined;
  all?: boolean | undefined;
};

/**
 * Type représentant le lien entre un utilisateur et une équipe
 */
export type UserTeam = {
  userId: string;
  teamId: string;
  userRole: string;
  createdAt: Date;
  updatedAt: Date;
};
