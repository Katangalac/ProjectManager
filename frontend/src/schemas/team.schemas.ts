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
