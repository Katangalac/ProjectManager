import { signToken } from "../lib/jwt/jwt";
import { SafeUser } from "../types/User";
import { toTokenPayload } from "./user.transforms";
import { updatePasswordData } from "../types/Auth";
import { db } from "../db";
import { hash, verify } from "argon2";
import { UserNotFoundError } from "../errors/user";
import { AppError } from "../errors/AppError";

/**
 * Génère le token d'authentification signé ainsi que les options de cookie dans lequel il sera stocké
 * @param {SafeUser} user : l'utilisateur dont on veut générer le token d'authentification
 * @returns : le token d'authentification signé ainsi que les options du cookie dans lequel il sera stocké
 */
export const generateAuthResponse = (user: SafeUser) => {
  const payload = toTokenPayload(user);
  const token = signToken(payload);
  return {
    token,
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      maxAge: 6 * 60 * 60 * 1000,
    },
  };
};

/**
 * Modifie le mot de passe de l'utilisateur
 * @async
 * @param {string} userId - identifiant de l'utilisateur
 * @param {string} updatePasswordData - objet contenant l'ancien et le nouveau mot de passe
 * @throws {UserNotFoundError} - Si aucun utilisaeur ayant l'identifiant n'a été trouvé
 */
export const updatePassword = async (
  userId: string,
  updatePasswordData: updatePasswordData,
) => {
  const { currentPassword, newPassword } = updatePasswordData;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new UserNotFoundError(userId);
  if (!user.password) throw new Error("This user doesn't have a password");
  const isValidPassword = await verify(user.password, currentPassword);
  if (!isValidPassword)
    throw new AppError("Invalid password", 400, "INVALID_PASSWORD");
  const hashedPassword = await hash(newPassword);
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
