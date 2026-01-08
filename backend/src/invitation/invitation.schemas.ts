import { InvitationStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma pour valider la structure de base d'une invitation dans la BD
 */
export const invitationSchema = z.object({
  id: z.uuid("ID invalide"),
  senderId: z.uuid("ID invalide"),
  receiverId: z.uuid("ID invalide"),
  teamId: z.uuid("ID invalide"),
  message: z.string(),
  status: z.enum(InvitationStatus),
  updatedAt: z.date(),
  createdAt: z.date(),
});

/**
 * Schéma pour valider les données attendues lors de la création d'une nouvelle invitation
 */
export const createInvitationSchema = invitationSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

/**
 * Schéma pour valider les données attendues lors de la modification d'une invitation
 */
export const updateInvitationDataSchema = z.object({
  status: z.enum(InvitationStatus),
});

/**
 * Schéma pour valider les données attendues comme filtre de recherche des taches
 */
export const searchInvitationsFilterSchema = z.object({
  senderId: z.string().optional(),
  receiverId: z.string().optional(),
  teamId: z.string().optional(),
  status: z.enum(InvitationStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  all: z
    .string()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid boolean value for 'all'",
          path: ["read"],
        },
      ]);
    })
    .optional(),
});
