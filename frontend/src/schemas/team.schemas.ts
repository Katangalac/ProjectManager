import { z } from "zod";

/**
 * Schéma de création d'une équipe
 */
export const createTeamSchema = z.object({
  leaderId: z.uuid("Invalid Id").nullable(),
  name: z.string().max(50, "Name is too long"),
  description: z.string(),
});

/**
 * Schéma de mise à jour d'une équipe
 */
export const updateTeamSchema = z.object({
  leaderId: z.uuid("Invalid Id").nullable().optional(),
  name: z.string().max(50, "Name is too long").optional(),
  description: z.string().optional(),
});

/**
 * Schéma d'une rélation entre equipe-membre
 */
export const TeamMemberSchema = z.object({
  teamId: z.uuid("Invalid ID"),
  userId: z.uuid("Invalid ID"),
  userRole: z.string().min(1, "User role must be defined"),
});

/**
 * Schéma de modification du role d'un membre dans une équipe
 */
export const UpdateMemberRoleSchema = z.object({
  memberId: z.uuid("Invalid ID"),
  teamId: z.uuid("Invalid ID"),
  memberRole: z.string().min(1, "User role must be defined"),
});
