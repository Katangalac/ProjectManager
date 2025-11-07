import { Request, Response, NextFunction } from "express";

/**
 * Vérifie si l'utiliateur a été authentifié et que c'est un admin
 * @param {Request} req - une requête Express qui doit contenir les informations sur l'utilisateur authentifié
 * @param {Response} res - réponse Express utilisé pour renvoyer la réponse JSON
 * @param {NextFunction} next - la fonction qui sera exécuté une fois que l'utilisateur est validé
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Authentification requise" });
        }

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Accès réservé aux administrateurs" });
        }
        next();
    } catch (err) {
        console.error("Erreur middleware isAdmin:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
};