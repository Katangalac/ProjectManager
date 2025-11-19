import { createUser } from "../user/user.services";
import { loginDataSchema, updatePasswordSchema } from "./auth.schemas";
import { createUserSchema } from "../user/user.schemas";
import { UserProvider } from "@prisma/client";
import { Request, Response } from "express";
import { generateAuthResponse, updatePassword } from "./auth.services";
import { updateUserLastLoginDateToNow } from "../user/user.services";
import { db } from "../db";
import { verify } from "argon2";
import { z } from "zod";
import { idParamSchema } from "../schemas/idparam.schema";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { UserNotFoundError } from "../user/errors";
import { addEmailToQueue } from "../email/email.queue";
import { addNotificationToQueue } from "../notification/notification.queue";
import { getWelcomeMessageHtml } from "../utils/utils";
import { verifyToken } from "./utils/jwt";

/**
 * Enregistre/inscrit un nouvel utilisateur dans le système
 * @async
 * @param {Request} req - requête Express contenant les informations du nouvel utilisateur dans req.body
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const register = async (req: Request, res: Response) => {
  try {
    const newUserData = createUserSchema.parse(req.body);
    let user = await createUser(newUserData, UserProvider.LOCAL);
    const { token, cookieOptions } = generateAuthResponse(user);
    res.cookie("projectFlowToken", token, cookieOptions);
    user = await updateUserLastLoginDateToNow(user.id);
    res.status(201).json(successResponse(user, "Utilisateur créé"));
    addNotificationToQueue(
      user.id,
      "Bienvenue 🎉",
      "Votre compte a été créé avec succès!"
    );
    const html = getWelcomeMessageHtml(user.userName);
    addEmailToQueue(user.email, "Bienvenue sur ProjectFlow", html);
  } catch (err) {
    console.error("Erreur lors de l'inscription : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de l'inscription")
      );
  }
};

/**
 * Connecte/authentifie un utilisateur enregistré dans le système
 * @async
 * @param {Request} req - requête Express contenant les informations de connexion dans req.body
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const login = async (req: Request, res: Response) => {
  try {
    const loginData = loginDataSchema.parse(req.body);
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: loginData.identifier },
          { userName: loginData.identifier },
        ],
      },
    });
    if (!user)
      return res.status(401).json({
        error: "Identifiants invalides. Cet utilisateur n'existe pas",
      });
    if (user.provider === UserProvider.LOCAL) {
      const { password, ...safeUser } = user;
      if (!password)
        return res
          .status(500)
          .json({ error: "Utilisateur local sans mot de passe!" });
      const isValidPassword = await verify(password, loginData.password);
      if (!isValidPassword)
        return res.status(401).json({ error: "Mot de passe invalide" });
      const { token, cookieOptions } = generateAuthResponse(safeUser);
      res.cookie("projectFlowToken", token, cookieOptions);
      const updatedUser = await updateUserLastLoginDateToNow(safeUser.id);
      res.status(200).json(successResponse(updatedUser, "Connexion réussie"));
    } else {
      res
        .status(500)
        .json(
          errorResponse(
            "NOT_A_LOCAL_USER",
            `Cet utilisateur s'est inscrit avec ${user.provider} et ne peut pas se connecter via le login local`
          )
        );
    }
  } catch (err) {
    console.error("Erreur lors de la connexion : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la connexion")
      );
  }
};

/**
 * Déconnecte un utilisateur
 * @async
 * @param {Request} req - requête Express
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
    };
    res.clearCookie("projectFlowToken", cookieOptions);
    res.json(successResponse(null, "Déconnexion réussie"));
  } catch (err) {
    console.error("Erreur lors de la déconnexion : ", err);
    res
      .status(500)
      .json(
        errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de la déconnexion")
      );
  }
};

/**
 * Modifie le mot de passe de l'utilisateur connecté
 * @async
 * @param {Request} req - requête Express
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 */
export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    const { id } = idParamSchema.parse({ id: req.user?.sub });
    const updatePasswordData = updatePasswordSchema.parse(req.body);
    await updatePassword(id, updatePasswordData);
    res
      .status(200)
      .json(successResponse(null, "Mot de passe modifié avec succès"));
  } catch (err) {
    console.error("Erreur de la modification du mot de passe", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json(errorResponse("INVALID_REQUEST", err.message));
    }

    if (err instanceof UserNotFoundError) {
      return res
        .status(404)
        .json(
          errorResponse(err.code ? err.code : "USER_NOT_FOUND", err.message)
        );
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "Erreur lors de la modification du mot de passe"
        )
      );
  }
};

/**
 * Vérifie si l'utilisateur est authentifié en vérifiant le token contenu dans les cookies
 * @param {Request} req - requete Express contenant les cookies
 * @param {Response} res - reponse Express en json, true si connecté, false sinon
 */
export const verifyAuth = async (req: Request, res: Response) => {
  if (!req.cookies.projectFlowToken) {
    return res.json({ authenticated: false });
  }
  try {
    verifyToken(req.cookies.projectFlowToken);
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
};
