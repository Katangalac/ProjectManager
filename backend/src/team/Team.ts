import { teamSchema, createTeamSchema, updateTeamDataSchema, searchTeamsFilterSchema,  userTeamSchema} from "./team.schemas";
import { z } from "zod";
import { Pagination } from "../types/Pagination";


/**
 * Type représentant les données attendues pour créer une équipe
 */
export type Team = z.infer<typeof teamSchema>;

/**
 * Type représentant les informations d'une équipe modifiable par un utilisateur
 */
export type CreateTeamData = z.infer<typeof createTeamSchema>;

/**
 * Type représentant les données attendues lors de la modification d'une équipe
 */
export type UpdateTeamData = z.infer<typeof updateTeamDataSchema>;

/**
 * Type représentant les données de filtre attendues lors d'Une recherche des équipes
 */
export type SearchTeamsFilter = z.infer<typeof searchTeamsFilterSchema>;

/**
 * Type représentant un utilisateur membre d'une équipe
 */
export type UserTeam = z.infer<typeof userTeamSchema>;

/**
 * Type représentant une liste d'équipes ainsi que les informations sur la pagination
 */
export type TeamsCollection = {
    teams: Team[],
    pagination: Pagination
};