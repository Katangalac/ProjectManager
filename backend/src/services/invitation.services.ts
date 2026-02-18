import {
  Invitation,
  CreateInvitationData,
  UpdateInvitationData,
  InvitationCollection,
  SearchInvitationFilter,
} from "@/types/Invitation";
import {
  InvitationAlreadySentError,
  InvitationNotFoundError,
} from "@/errors/invitation";
import { buildInvitationWhereInput, buildPaginationInfos } from "@/utils/utils";
import { db } from "@/db";
import { Prisma } from "@prisma/client";
import { addNotificationToQueue } from "@/lib/bullmq/notification.queue";
import { addUserToTeam } from "@/services/team.services";

/**
 * Crée et envoie une nouvelle invitation
 * @async
 * @param {CreateInvitationData} invitationData - les informations sur le message à créer
 * @returns {Invitation} - l'invitation créée
 * @throws {InvitationAlreadySentError} - si une invitation au même destinaire est déjà en attente d'une réponse
 */
export const sendInvitation = async (
  invitationData: CreateInvitationData,
): Promise<CreateInvitationData> => {
  const existing = await db.invitation.findFirst({
    where: {
      senderId: invitationData.senderId,
      receiverId: invitationData.receiverId,
      teamId: invitationData.teamId,
      status: "PENDING",
    },
  });

  if (existing) {
    throw new InvitationAlreadySentError();
  }

  const invitation = await db.invitation.create({
    data: {
      ...invitationData,
    },
    include: {
      sender: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  try {
    await addNotificationToQueue(
      invitation.receiverId,
      `NEW_INVITATION-${invitation.id}`,
      "You’ve been invited to join a team. Check it out.",
    );
  } catch (err: any) {
    console.error("Erreur lors de l'ajout de la notification", err);
  }

  return invitation;
};

/**
 * Récupère l'invitation' ayant l'identifiant donné
 * @param {string} id - identifiant de l'invitation'
 * @returns {Invitation} - l'invitation' ayant l'identifiant donné
 * @throws {InvitationNotFoundError} - lorsqu'aucune invitation avec l'identifiant a été trouvée
 */
export const getInvitationById = async (id: string): Promise<Invitation> => {
  const invitation = await db.invitation.findUnique({
    where: { id },
    include: {
      sender: true,
      receiver: true,
      team: true,
    },
  });
  if (!invitation) throw new InvitationNotFoundError(id);
  return invitation;
};

/**
 * Récupère toutes les invitations respectant le filtre de recherche donné
 * @param {SearchInvitationsFilter} filter - filtre de recherche à utiliser
 * @returns {InvitationsCollection} - la liste d'invitations respectant le filtre de recherche
 */
export const getInvitations = async (
  filter: SearchInvitationFilter,
): Promise<InvitationCollection> => {
  const { page, pageSize, all, ..._ } = filter;

  //Construction du WHERE à partir des filtres
  const where = buildInvitationWhereInput(filter);

  //Compte total des invitations correspondant au filtre
  const totalItems = await db.invitation.count({ where });

  //Construction de la requête principale
  const query: Prisma.InvitationFindManyArgs = {
    where,
    include: {
      sender: true,
      receiver: true,
    },
    orderBy: { createdAt: "desc" },
  };

  if (!all) {
    query.skip = (page - 1) * pageSize;
    query.take = pageSize;
  }

  //Exécution de la requête
  const invitations = await db.invitation.findMany(query);

  //Calcul pagination
  const pagination = buildPaginationInfos(all, page, pageSize, totalItems);

  return {
    invitations: invitations,
    pagination,
  };
};

/**
 * Modifie une invitation
 * @async
 * @param {string} invitationId - identifiant de l'invitation
 * @param {UpdateInvitationData} updateData - objet contenantle nouveau status de l'invitation
 * @returns {Invitation} - l'invitation avec le nouveau status
 * @throws {InvitationNotFoundError} - lorsqu'aucune invitation avec l'identifiant passé en paramètre n'a été trouvée
 */
export const updateInvitationStatus = async (
  invitationId: string,
  updateData: UpdateInvitationData,
): Promise<Invitation> => {
  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
  });
  if (!invitation) throw new InvitationNotFoundError(invitationId);

  if (updateData.status === "ACCEPTED") {
    await addUserToTeam(invitation.receiverId, invitation.teamId, "Member");
  }

  const updatedInvitation = await db.invitation.update({
    where: { id: invitationId },

    data: { ...updateData, updatedAt: new Date() },
  });

  try {
    await addNotificationToQueue(
      invitation.senderId,
      `INVITATION_UPDATED-${invitation.id}`,
      "Your team invitation has been updated. See what changed.",
    );
  } catch (err: any) {
    console.error("Erreur lors de l'ajout de la notification", err);
  }

  return updatedInvitation;
};

/**
 * Supprime l'invitation ayant l'identifiant passé en paramètre
 * @async
 * @param {string} invitationId - identifiant de l'invitation
 * @throws {InvitationNotFoundError} - lorsqu'aucune invitation avec l'identifiant passé en paramètre n'a été trouvée
 */
export const deleteInvitation = async (invitationId: string) => {
  const invitation = await db.invitation.findUnique({
    where: { id: invitationId },
  });
  if (!invitation) throw new InvitationNotFoundError(invitationId);
  await db.invitation.delete({ where: { id: invitationId } });
};
