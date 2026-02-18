import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/Auth";
import { resetPasswordTokenPayloadSchema } from "@/schemas/auth.schemas";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "6h";

/**
 * Signe le token d'authentification avec jwt
 * @param {TokenPayload} payload : le payload du token d'authentification
 * @return {string}: une chaine de caractères contenant le token signé
 */
export const signToken = (payload: TokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Vérifie si le token passé en paramètre a été signé par l'application ou non
 * @param {string} token : un token d'authentification
 */
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);

/**
 * Signe le token le token de reset de password avec jwt
 * @param {string} userId : id de l'utilisateur
 * @return {string}: une chaine de caractères contenant le token signé
 */
export const signResetPasswordToken = (userId: string) =>
  jwt.sign(
    {
      userId,
      action: "reset_password",
    },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

/**
 * Vérifie si le token passé en paramètre a été signé par l'application pur le reset de password ou non
 * @param {string} token : un token de reset de password
 */
export const verifyResetPasswordToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET);
  const resetPasswordTokenPayload =
    resetPasswordTokenPayloadSchema.parse(payload);

  if (resetPasswordTokenPayload.action !== "reset_password") {
    throw new Error("Invalid token type");
  }

  return resetPasswordTokenPayload;
};
