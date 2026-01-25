import { verifyToken } from "./utils/jwt";
import { Request, Response, NextFunction } from "express";
import { tokenPayloadSchema } from "./auth.schemas";

/**
 * Vérifie si l'utiliateur a été authentifié en vérifiant si un token d'authentification valide a été
 * transmis dans la requête.
 * @param {Request} req - une requête Express qui doit contenir un token d'authentification
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @param {NextFunction} next - la fonction qui sera exécuté une fois le token validé
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Chercher le token dans bearer token dans le header authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Chercher le token le header authorization
  if (!token && req.cookies?.projectFlowToken) {
    token = req.cookies.projectFlowToken;
  }

  // Pas de token => non autorisé
  if (!token) {
    return res.status(401).json({
      error: "Token d'authentification manquant",
    });
  }

  if (!token)
    return res.status(401).json({ error: "Jeton d'authentification manquant" });

  try {
    const decodedRaw = verifyToken(token);
    const tokenPayload = tokenPayloadSchema.parse(decodedRaw);
    req.user = tokenPayload;
    console.log("USER GET", req.user);
    next();
  } catch {
    res.status(401).json({ error: "Jeton d'authentification invalide" });
  }
};
