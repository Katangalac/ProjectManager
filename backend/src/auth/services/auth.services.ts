import { signToken } from "../utils/jwt";
import { SafeUser } from "../../user/types/User";
import { toTokenPayload } from "../../user/services/user.transforms";

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

