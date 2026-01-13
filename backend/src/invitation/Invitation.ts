import {
  invitationSchema,
  searchInvitationsFilterSchema,
  updateInvitationDataSchema,
  createInvitationSchema,
} from "./invitation.schemas";
import { z } from "zod";
import { Pagination } from "../types/Pagination";

/**
 * Type représentant la structure d'une invitation
 */
export type Invitation = z.infer<typeof invitationSchema>;

/**
 * Type représentant la structure des données de création d'une invitation
 */
export type CreateInvitationData = z.infer<typeof createInvitationSchema>;

/**
 * Type représentant la structure des données de modification d'une invitation
 */
export type UpdateInvitationData = z.infer<typeof updateInvitationDataSchema>;

/**
 * Type représentant la structure des données de création d'une invitation
 */
export type SearchInvitationFilter = z.infer<
  typeof searchInvitationsFilterSchema
>;

export type InvitationCollection = {
  invitations: Invitation[];
  pagination: Pagination;
};
