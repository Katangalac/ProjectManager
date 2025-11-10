import { createUser } from "../user/user.services";
import { loginDataSchema} from "./auth.schemas";
import { createUserSchema } from "../user/user.schemas";
import { UserProvider } from "@prisma/client";
import { Request, Response } from "express";
import { generateAuthResponse } from "./auth.services";
import { updateUserLastLoginDateToNow } from "../user/user.services";
import { db } from "../db";
import { verify} from "argon2";
import { ZodError } from "zod";

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
        res.cookie("projectManagerToken", token, cookieOptions);
        user = await updateUserLastLoginDateToNow(user.id);
        res.status(201).json({ message: "Utilisateur créé", user });
    } catch (err) {
        console.error("Erreur lors de l'inscription : ", err);
        if (err instanceof ZodError) {
            res.status(400).json({ error: "Données d'inscription invalides"});
        }
        res.status(500).json({ error: "Erreur lors de l'inscription"});
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
                    {userName: loginData.identifier}
                ],
            },
        });  
        if (!user) return res.status(401).json({ error: "Identifiants invalides. Cet utilisateur n'existe pas" });
        if (user.provider === UserProvider.LOCAL) {
            const { password, ...safeUser } = user;
            if (!password) return res.status(500).json({ error: "Utilisateur local sans mot de passe!" });
            const isValidPassword = await verify(password, loginData.password);
            if (!isValidPassword) return res.status(401).json({ error: "Mot de passe invalide" });
            const { token, cookieOptions } = generateAuthResponse(safeUser);
            res.cookie("projectManagerToken", token, cookieOptions);
            const updatedUser = await updateUserLastLoginDateToNow(safeUser.id);
            res.status(200).json({ message: "Connexion réussie", updatedUser });
        }
        else {
            res.status(500).json({error: `Cet utilisateur est inscrit avec ${user.provider}`})
        }
    } catch (err) {
        console.error("Erreur lors de la connexion : ", err);
        if (err instanceof ZodError) {
            res.status(400).json({ error: "Données de connexion invalides"});
        }
        res.status(500).json({ error: "Erreur lors de la connexion"});
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
            sameSite: "lax" as const
        };
        res.clearCookie("projectManagerToken", cookieOptions);
        res.json({ message: "Déconnexion réussie" });
    } catch (err) {
        console.error("Erreur lors de la déconnexion : ", err);
        res.status(500).json({ error: "Erreur lors de la déconnexion"});
    }
};

