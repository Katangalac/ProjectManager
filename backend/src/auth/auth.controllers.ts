import { createUser } from "../user/user.services";
import { loginDataSchema, updatePasswordSchema } from "./auth.schemas";
import { createUserSchema } from "../user/user.schemas";
import { UserProvider } from "@prisma/client";
import { Request, Response } from "express";
import { generateAuthResponse, updatePassword } from "./auth.services";
import { updateUserLastLoginDateToNow } from "../user/user.services";
import { db } from "../db";
import { verify, hash } from "argon2";
import { z } from "zod";
import { idParamSchema } from "../schemas/idparam.schema";
import { successResponse, errorResponse } from "../utils/apiResponse";
import {
  UserNotFoundError,
  UsernameAlreadyUsedError,
  EmailAlreadyUsedError,
  UserAlreadyExistError,
  PhoneNumberAlreadyUsedError,
} from "../user/errors";
import { addEmailToQueue } from "../email/email.queue";
import { addNotificationToQueue } from "../notification/notification.queue";
import {
  getForgetPasswordMessageHtml,
  getWelcomeMessageHtml,
} from "../utils/utils";
import {
  signResetPasswordToken,
  verifyResetPasswordToken,
  verifyToken,
} from "./utils/jwt";
import { AppError } from "../errors/AppError";

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

    try {
      await addNotificationToQueue(
        user.id,
        "🚀 Welcome aboard ProjectFlow!",
        "Jump right in and start planning projects, tracking tasks, and staying productive.",
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout de la notification", err);
    }

    try {
      const html = getWelcomeMessageHtml(user.userName);
      await addEmailToQueue(user.email, "Bienvenue sur ProjectFlow", html);
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'email dans la queue", err);
    }
  } catch (err) {
    console.error("Erreur lors de l'inscription : ", err);
    if (err instanceof z.ZodError) {
      res.status(400).json(errorResponse("INVALID_REQUEST", err.message));
    }
    if (err instanceof UserAlreadyExistError) {
      return res
        .status(err.status || 409)
        .json(errorResponse(err.code || "USER_CONFLICT", err.message));
    }
    if (err instanceof UsernameAlreadyUsedError) {
      return res
        .status(err.status || 409)
        .json(errorResponse(err.code || "USERNAME_CONFLICT", err.message));
    }
    if (err instanceof EmailAlreadyUsedError) {
      return res
        .status(err.status || 409)
        .json(errorResponse(err.code || "EMAIL_CONFLICT", err.message));
    }
    res
      .status(500)
      .json(
        errorResponse("INTERNAL_SERVER_ERROR", "Erreur lors de l'inscription"),
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
      return res
        .status(500)
        .json(errorResponse("INVALID_CREDENTIALS", "Invalid credentials"));
    if (user.provider === UserProvider.LOCAL) {
      const { password, ...safeUser } = user;
      if (!password)
        return res
          .status(500)
          .json(
            errorResponse(
              "LOCAL_USER_WITHOUT_PASSWORD",
              "This local user doesn't have a password",
            ),
          );
      const isValidPassword = await verify(password, loginData.password);
      if (!isValidPassword)
        return res
          .status(500)
          .json(errorResponse("INVALID_PASSWORD", "Invalid password"))
      console.error("USER GET LOGIN");
      const { token, cookieOptions } = generateAuthResponse(safeUser);
      console.error("TOKEN:", token);
      res.cookie("projectFlowToken", token, cookieOptions);
      const updatedUser = await updateUserLastLoginDateToNow(safeUser.id);
      console.log("options", cookieOptions);

      res.status(200).json(successResponse(updatedUser, "Connexion réussie"));
    } else {
      res
        .status(500)
        .json(
          errorResponse(
            "NOT_A_LOCAL_USER",
            `This user is from ${user.provider} and must log the ${user.provider} way`,
          ),
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
        errorResponse("INTERNAL_SERVER_ERROR", "An error occur while login"),
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
      sameSite: "none" as const,
    };
    res.clearCookie("projectFlowToken", cookieOptions);
    res.status(200).json(successResponse(null, "Déconnexion réussie"));
  } catch (err) {
    console.error("Erreur lors de la déconnexion : ", err);
    res
      .status(500)
      .json(
        errorResponse("INTERNAL_SERVER_ERROR", "An error occur while logout"),
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
          errorResponse(err.code ? err.code : "USER_NOT_FOUND", err.message),
        );
    }

    if (err instanceof AppError) {
      return res
        .status(err.status)
        .json(
          errorResponse(err.code ? err.code : "UNKNOWN_ERROR", err.message),
        );
    }

    res
      .status(500)
      .json(
        errorResponse(
          "INTERNAL_SERVER_ERROR",
          "An error occur while handling your request",
        ),
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

/**
 *Declenche le processus de reinitialisation du mot de passe
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.json(
      successResponse(
        null,
        "If this email exists, a reset link has been sent.",
      ),
    );
  }
  const token = signResetPasswordToken(user.id);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = getForgetPasswordMessageHtml(resetUrl);
  await addEmailToQueue(user.email, "Reset Password", html);

  return res.json(
    successResponse(null, "If this email exists, a reset link has been sent."),
  );
};

/**Valide le token de reinitialisation de mot de passe */
export const validateResetToken = (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const payload = verifyResetPasswordToken(token);
    return res.json(
      successResponse({
        valid: true,
        userId: payload.userId,
      }),
    );
  } catch (err) {
    return res.status(400).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
};

/**Reinitialise le mot de passe de l'utilisateur */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const payload = verifyResetPasswordToken(token);
    const userId = payload.userId;
    const hashedPassword = await hash(newPassword);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.json(successResponse(null, "Password updated successfully."));
  } catch (err) {
    return res
      .status(400)
      .json(errorResponse("INVALID_TOKEN", "Invalid or expired token."));
  }
};
