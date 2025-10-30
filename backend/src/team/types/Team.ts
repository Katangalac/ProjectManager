import { teamSchema, teamDataSchema, updateTeamDataSchema, userTeamSchema} from "../validators";
import { z } from "zod";

/**
 * Type représentant les informations d'une équipe modifiable par un utilisateur
 */
export type TeamData = z.infer<typeof teamDataSchema>;

/**
 * Type représentant les données attendues pour créer une équipe
 */
export type Team = z.infer<typeof teamSchema>;

/**
 * Type représentant les données attendues lors de la modification d'une équipe
 */
export type UpdateTeamData = z.infer<typeof updateTeamDataSchema>;

/**
 * Type représentant un utilisateur membre d'une équipe
 */
export type UserTeam = z.infer<typeof userTeamSchema>;