import { Request } from "express";

//Format des numéros de téléphone
export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Recupère l'id d'un utilisateur contenu dans une requête
 * Si l'utilisateur est authentifié, l'id est contenu dans la propriété user de la requête
 * Sinon, l'id est recupéré parmi le paramètre de la requête
 */
export const getUserIdFromRequest = (req:Request): string|undefined => {
    return req.params.id ?? req.user?.sub;
}