import { signToken } from "./utils/jwt";
import { SafeUser } from "../user/User";
import { toTokenPayload } from "../user/user.transforms";
import { updatePasswordData } from "./Auth";
import { db } from "../db";
import { hash, verify } from "argon2";
import { UserNotFoundError } from "../user/errors";

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
            sameSite:"lax" as const,
            maxAge:3600_000,
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
export const updatePassword = async (userId: string, updatePasswordData: updatePasswordData) => {
    const {currentPassword, newPassword } = updatePasswordData;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new UserNotFoundError(userId);
    if (!user.password) throw new Error("L'utilisateur ne possède pas de mot de passe");
    const isValidPassword = await verify(user.password, currentPassword);
    if (!isValidPassword) throw new Error("Mot de passe invalide");
    const hashedPassword = await hash(newPassword);
    await db.user.update({
        where: { id: userId },
        data: {password: hashedPassword}
    });
};

