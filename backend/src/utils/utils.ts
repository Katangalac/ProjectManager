import { Request } from "express";

//Format des numéros de téléphone
export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Recupère l'id d'un utilisateur contenu dans une requête
 * Si l'utilisateur est authentifié, l'id est contenu dans la propriété user de la requête
 * Sinon, l'id est recupéré parmi le paramètre de la requête
 */
export const getUserIdFromRequest = (req: Request): string | undefined => {
    return req.params.id ?? req.user?.sub;
};

/**
 * Retire les propriétés/champs d'un objet ayant la valeur undefined
 * @param {T} obj : un objet qui peut être de n'importe quel type
 * @returns l'objet passé en  paramètre sans les propriétés/champs qui étaient undefined
 */
export const removeUndefined = <T extends Record<string, any>>(obj: T): {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
} => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as any;
};

