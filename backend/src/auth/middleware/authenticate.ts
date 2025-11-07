import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { tokenPayloadSchema } from "../schemas/auth.schemas";


/**
 * Vérifie si l'utiliateur a été authentifié en vérifiant si un token d'authentification valide a été
 * transmis dans la requête.
 * @param {Request} req - une requête Express qui doit contenir un token d'authentification
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @param {NextFunction} next - la fonction qui sera exécuté une fois le token validé
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Jeton d'authentification manquant" });

    try {
        const decodedRaw = verifyToken(token);
        const tokenPayload = tokenPayloadSchema.parse(decodedRaw);
        req.user = tokenPayload;
        next();
    } catch {
        res.status(401).json({ error: "Jeton d'authentification invalide" });
    }
};