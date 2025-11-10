import { Request, Response } from "express";
import { exchangeCodeForToken, getGoogleUser } from "./googleAuth.services";
import { db } from "../../db";
import { generateAuthResponse } from "../auth.services";
import { UserProvider } from "@prisma/client";
import { createUser } from "../../user/user.services";
import { ZodError } from "zod";
import { getUserByEmail, updateUserLastLoginDateToNow } from "../../user/user.services";

const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback"

/**
 * Initialise le processus d'authentification OAuth2.0 avec Google
 * Génère une URL contenant les paramètres nécessaires (client_id, redirect_uri, scope, etc.)
 * et redirige l'utilisateur vers la page de connexion Google.
 * @param {Request} req - requête Express
 * @param {Response} res - réponse Express
 */
export const googleAuth = (req: Request, res: Response) => {
    const redirectUri =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=openid%20email%20profile`;
    res.redirect(redirectUri);
};

/**
 * Gère le callback de Google après l'authentification OAuth 2.0
 * Cette fonction est appelée lorsque Google redirige l'utilisateur vers l'application
 * après une authentification réussie : 
 * 1. Récupère le code d'autorisation dans la requête.
 * 2. Échange ce code contre un jeton d'accès auprès des serveurs Google.
 * 3. Utilise le jeton pour obtenir les informations du profil utilisateur Google.
 * 4. Vérifie si l'utilisateur existe déjà dans la base de données, sinon le crée.
 * 5. Génère un JWT (ou une session) et redirige l'utilisateur vers le frontend.
 * @async
 * @param {Request} req - requête Express contenant le code d'autorisation Google dans req.query.code
 * @param {Response} res - réponse Express contenant la réponse JSON
 */
export const googleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;

    try {
        const { id_token, access_token } = await exchangeCodeForToken(code, REDIRECT_URI);
        const googleUser = await getGoogleUser(access_token);
        const { email, name, sub } = googleUser;
        let user = await getUserByEmail(email);
        if (!user) {
            const baseUsername = name.replace(/\s+/g, '').toLowerCase();
            let username = baseUsername;
            let count = 1;

            // vérifie s’il existe déjà un utilisateur avec ce username
            while (await db.user.findUnique({ where: { userName: username } })) {
                username = `${baseUsername}${count++}`;
            }
            const userData = { email: email, userName: username, password: null };
            user = await createUser(userData, UserProvider.GOOGLE, sub);
        } 
        const { token, cookieOptions } = generateAuthResponse(user);
        res.cookie("projectManagerToken", token, cookieOptions);
        user = await updateUserLastLoginDateToNow(user.id);
        res.status(200).json({ message: "Connexion Google réussie", user });
    } catch (err) {
        console.error("Erreur d’authentification Google", err);
        if (err instanceof ZodError) {
                    res.status(400).json({ error: "Erreur d’authentification Google : données d'inscription invalides"});
                }
        res.status(500).json({ error: "Erreur d’authentification Google"});
    }
};