import * as invitationService from "./invitation.services";
import * as invitationSchema from "./invitation.schemas";
import { InvitationAlreadySentError, InvitationNotFoundError } from "./errors";
import { Request, Response } from "express";
import { idParamSchema } from "../schemas/idparam.schema";
import { z } from "zod";
import { successResponse, errorResponse } from "../utils/apiResponse";

/**
 * Crée une nouvelle invitation
 * @param {Request} req : requête Express contenant les infos de l'invitation à créer
 * @param {Response} res : réponse Express en JSON
 */
export const createInvitationController = async (
  req: Request,
  res: Response
) => {
  try {
    const invitationData = invitationSchema.createInvitationSchema.parse(
      req.body
    );
    const newInvitation = await invitationService.sendInvitation(
      invitationData
    );
    res.status(201).json(successResponse(newInvitation, "Invitation créée"));
  } catch (err) {
    console.error("Erreur lors de la création de l'invitation", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof InvitationAlreadySentError) {
      res
        .status(err.status)
        .json(errorResponse(err.code || "INVITATION_CONFLICT", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la création de l'invitation"
        )
      );
  }
};

/**
 * Récupère les invitations respectant le filtre passé en paramètre
 * @param {Request} req : requête Express
 * @param {Response} res : réponse Express en JSON
 */
export const getInvitationsController = async (req: Request, res: Response) => {
  try {
    const filter = invitationSchema.searchInvitationsFilterSchema.parse(
      req.query
    );
    const invitationsCollection = await invitationService.getInvitations(
      filter
    );
    res
      .status(200)
      .json(
        successResponse(
          invitationsCollection.invitations,
          "Invitations récpérées",
          invitationsCollection.pagination
        )
      );
  } catch (err) {
    console.error("Erreur lors de la récupération des invitations", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération des invitations"
        )
      );
  }
};

/**
 * Récupère l'invitation ayant l'identifiant passé en paramètre
 * @param {Request} req : requête Express contenant l'identifiant de l'invitation
 * @param {Response} res : réponse Express en JSON
 */
export const getInvitationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const invitation = await invitationService.getInvitationById(id);
    res.status(200).json(successResponse(invitation, "Invitation récupérée"));
  } catch (err) {
    console.error("Erreur lors de la récupération de l'invitation'", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof InvitationNotFoundError) {
      res
        .status(err.status)
        .json(
          errorResponse(
            err.code ? err.code : "INVITATION_NOT_FOUND",
            err.message
          )
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la récupération de l'invitation"
        )
      );
  }
};

/**
 * Accepte une invitation
 * @param {Request} req : requête Express contenant l'identifiant de l'invitation
 * @param {Response} res : réponse Express en JSON
 */
export const acceptInvitationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const updatedInvitation = await invitationService.updateInvitationStatus(
      id,
      { status: "ACCEPTED" }
    );
    res
      .status(200)
      .json(
        successResponse(updatedInvitation, "Status de l'invitation mise à jour")
      );
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour du status de l'invitation",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof InvitationNotFoundError) {
      res
        .status(err.status)
        .json(
          errorResponse(
            err.code ? err.code : "INVITATION_NOT_FOUND",
            err.message
          )
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour de l'invitation"
        )
      );
  }
};

/**
 * Refuse une invitation
 * @param {Request} req : requête Express contenant l'identifiant de l'invitation
 * @param {Response} res : réponse Express en JSON
 */
export const rejectInvitationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    const updatedInvitation = await invitationService.updateInvitationStatus(
      id,
      { status: "REJECTED" }
    );
    res
      .status(200)
      .json(
        successResponse(updatedInvitation, "Status de l'invitation mise à jour")
      );
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour du status de l'invitation",
      err
    );
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof InvitationNotFoundError) {
      res
        .status(err.status)
        .json(
          errorResponse(
            err.code ? err.code : "INVITATION_NOT_FOUND",
            err.message
          )
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la mise à jour de l'invitation"
        )
      );
  }
};

/**
 * Supprime l'invitation ayant l'identifiant passé en paramètre
 * @param {Request} req : requête Express contenant l'identifiant de l'invitation'
 * @param {Response} res : réponse Express en JSON
 */
export const deleteInvitationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = idParamSchema.parse({ id: req.params.id });
    await invitationService.deleteInvitation(id);
    res.status(204).send();
  } catch (err) {
    console.error("Erreur lors de la suppression de l'invitation'", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof InvitationNotFoundError) {
      res
        .status(err.status)
        .json(
          errorResponse(
            err.code ? err.code : "INVITATION_NOT_FOUND",
            err.message
          )
        );
    }
    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la suppression de l'invitation"
        )
      );
  }
};
