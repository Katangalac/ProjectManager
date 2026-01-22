/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/types/User";

/**
 * Transforme un nom en acronyme de 2 lettres en majuscules
 * Si le nom est composé des séparateurs (/,_,-) retourne les premieres lettress
 * de 2 premieres parties, sinon retourne le 2 premieres lettres du nom
 *
 * Eexemple : Equipe-1 => E1, Equipe1 => EQ, E => E
 *
 * @param {string} name - le nom à transformé en acronyme
 * @returns l'acronyme du nom passé en paramètre
 */
export const getAcronymeFromName = (name: string) => {
  if (!name) return "";

  const nameParts = name.split(/[ /_-]+/).filter((p) => p.length > 0);

  if (nameParts.length === 1) {
    const part = nameParts[0];

    if (part.length === 1) return part.toUpperCase();
    return (part[0] + part[1]).toUpperCase();
  }

  const first = nameParts[0][0];
  const last = nameParts[nameParts.length - 1][0];

  return (first + last).toUpperCase();
};

/**
 * Récupère le suffixe ordinal (nd, rd, th, st) d'un nombre
 *
 * @param {number} n - le nombre dont on veut récupérer le suffixe ordinal
 * @returns le suffixe ordinal correspondant au nombre
 */
export const getOrdinalSuffix = (n: number): string => {
  if (n % 100 >= 11 && n % 100 <= 13) {
    return "th";
  }

  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

/**
 * Associe une chaine de caractère à une couleur en utilisant un hachage
 * Utiliser en autres pour associer un utilisateur/une équipe à une couleur via son ID
 *
 * @param {string} str - la chaine de caractère
 * @param {string[]} colors - la liste des couleurs
 * @returns l'index de la couleur correspondant à la chaine passée en paramètre
 */
export const stringToColorIndex = (str: string, colors: string[]): number => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // petit hash rapide
  }

  return hash % colors.length;
};

/**
 * Retourne la couleur correspondant à une chaine de caractère
 *
 * @param {string} str - la chaine de caractère
 * @param {string[]} colors - la liste des couleurs
 * @returns la couleur correspondant à la chaine passée en paramètre
 */
export const stringToColor = (str: string, colors: string[]): string => {
  const index = stringToColorIndex(str, colors);
  return colors[index];
};

/**
 * Retourne le lable(Identifant) correspondant à un utilisateur
 *
 * @param {User} user - l'utilisateur
 * @returns Le label de l'utilisateur (username || prenom + nom)
 */
export const getUserLabel = (user: User): string => {
  return user.firstName && user.lastName
    ? user.firstName + " " + user.lastName
    : user.userName;
};

/**
 * Record de titre de notifications
 */
const notificationTitleMap: Record<string, string> = {
  NEW_INVITATION: "New invitation",
  INVITATION_UPDATED: "Invitation replied",
  NEW_TASK: "New task",
  UNASSIGN_TASK: "Task unassigned",
  NEW_TEAM: "New team",
  REMOVE_FROM_TEAM: "Removed from team",
  NEW_TEAM_ROLE: "New team role",
};

/**
 * Retourne la description associer à un titre de notification
 *
 * @param {string} rawTitle - le titre brute de la notification
 * @returns la description/titre raffiné de la notification
 */
export const getNotificationTitle = (
  rawTitle: string
): { title: string; payload: string } => {
  const index = rawTitle.indexOf("-");
  const type = index === -1 ? rawTitle : rawTitle.slice(0, index).trim();
  const payload = index === -1 ? "" : rawTitle.slice(index + 1).trim();

  return {
    title: notificationTitleMap[type] ?? rawTitle,
    payload: notificationTitleMap[type] ? payload : "",
  };
};

/**
 * Vérifie si un objet est vide
 */
export function isObjectNotEmpty(object: any): boolean {
  return Object.entries(object).some(([_, value]) => {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    return true;
  });
}
