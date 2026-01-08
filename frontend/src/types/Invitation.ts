import {
  invitationSchema,
  searchInvitationsFilterSchema,
  updateInvitationDataSchema,
  createInvitationSchema,
} from "../schemas/invitation.schemas";
import { z } from "zod";
import { Pagination } from "../types/Pagination";
import { User } from "./User";

/**
 * Type représentant la structure d'une invitation
 */
export type Invitation = z.infer<typeof invitationSchema>;

export type InvitationWithRelations = Invitation & {
  sender?: User;
  receiver?: User;
};

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

/**
 * Type représentant la structure des responses API pour une requte de recupération des invitations
 */
export type InvitationsCollectionApiResponse = {
  data: InvitationWithRelations[];
  success: boolean;
  pagination?: Pagination;
  message?: string;
};

/**
 * Type représentant la structure des responses API pour une requte de recupération d'une invitation
 */
export type InvitationApiResponse = {
  data: InvitationWithRelations;
  success: boolean;
};
