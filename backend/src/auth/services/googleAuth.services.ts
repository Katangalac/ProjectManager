import axios from "axios";
import qs from "qs";

const GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";

/**
 * Échange le code d'autorisation retourné par Google contre un jeton d'accès et d'identité
 * Le code temporaire reçu dans le callback est envoyé à l'API OAuth de Google 
 * @async
 * @param {string} code - le code d'autorisation renvoyé par Google dans la requête de callback
 * @param {string} redirectUri - l'url de redirection enregistrée dans la console Google Cloud
 * @returns un objet contenant les jetons id_token et access_token fournis par Google
 */
export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
    const params = qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    });
    const response = await axios.post(
        GOOGLE_TOKEN_URI,
        params,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return response.data;
}

/**
 * Récupère les informations du profil utilisateur Google à partir du jeton d'accès (access token)
 * Retourne les informations de base du compte Google de l'utilisateur
 * @async
 * @param accessToken - le jeton d'accès OAuth 2.0 fourni par Google
 * @returns les informations de l'utilisateur Google : {sub: string, email: string, name: string, picture: string}
 */
export const getGoogleUser = async (accessToken: string) => {
    const response = await axios.get(GOOGLE_USERINFO_URI, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
}