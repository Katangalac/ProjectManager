import jwt from "jsonwebtoken";
import { TokenPayloadType } from "../types/Auth";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '1h';

/**
 * Signe le token d'authentification avec jwt
 * @param {TokenPayloadType} payload : le payload du token d'authentification 
 * @return {string}: une chaine de caractères contenant le token signé
 */
export const signToken = (payload: TokenPayloadType) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Vérifie si le token passé en paramètre a été signé par l'application ou non
 * @param {string} token : un token d'authentification 
 */
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);
