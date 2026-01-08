import { z } from "zod";

export const createTeamSchema = z.object({
  leaderId: z.uuid("Invalid Id").nullable(),
  name: z.string().max(50, "Name is too long"),
  description: z.string(),
});

export const updateTeamSchema = z.object({
  leaderId: z.uuid("Invalid Id").nullable().optional(),
  name: z.string().max(50, "Name is too long").optional(),
  description: z.string().optional(),
});

export const TeamMemberSchema = z.object({
  teamId: z.uuid("Invalid ID"),
  userId: z.uuid("Invalid ID"),
  userRole: z.string().min(1, "User role must be defined"),
});

export const UpdateMemberRoleSchema = z.object({
  userId: z.uuid("Invalid ID"),
  userRole: z.string().min(1, "User role must be defined"),
});
