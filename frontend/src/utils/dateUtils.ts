import { getOrdinalSuffix } from "./stringUtils";
import { MONTHS } from "@/lib/constants/date";

/**
 * Trasnforme une date en texte
 * Exemple : new Date(12-01-2026) => January the 12th, 2026
 *
 * @param {Date} date - l'objet date à transformer en chaine de caracteres
 * @returns la date sous la forme d'une chaine de caractere
 */
export const dateToLongString = (date: Date): string => {
  const dateNumber = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const dateString = `${MONTHS[monthIndex]} the ${dateNumber}${getOrdinalSuffix(dateNumber)}, ${year}`;
  return dateString;
};

/**
 * Retourne le temps depuis la date passée en paramètre
 * Prend l'unité de temps le plus proche (seconde, minute, heure,...)
 * Si le delai est d'un mois ou plus, retourne la date soit en format long (voir @function dateToLongString}),
 * soit en format ISO (sans heure).
 *
 * @param {Date} date - la date-heure à partir duquel on veut calculer le temps ecouler
 * @param {boolean} short - Détermine si on retourne la version longue ou courte de la réponse
 * @returns - le temps écoulé depuis la date passée en paramètre ou la date elle-même si le délai >= 1mois
 */
export const timeAgo = (date: Date, short: boolean = false): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "In the future";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) {
    return short ? `${seconds}s ago` : `${seconds} sec ago`;
  }

  if (minutes < 60) {
    return short ? `${minutes}m ago` : `${minutes} min ago`;
  }

  if (hours < 24) {
    return short ? `${hours}h ago` : `${hours} hour(s) ago`;
  }

  if (days < 7) {
    return short ? `${days}d ago` : `${days} day(s) ago`;
  }

  if (weeks < 4) {
    return short ? `${weeks}w ago` : `${weeks} week(s) ago`;
  }

  return short
    ? `${date.toISOString().split("T")[0]}`
    : `${dateToLongString(date)}`;
};

/**
 * Trasnforme une date en texte (version courte)
 * Ne retourne pas l'année si elle est en cours
 * Exemple : new Date(12-01-2026) => Jan 12, 2026 || Jan 12 si on est en 2026
 *
 * @param {Date} date - l'objet date à transformer en chaine de caracteres
 * @returns la date sous la forme d'une chaine de caractere
 */
export const formatShortDateWithOptionalYear = (date: Date): string => {
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const base = date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());

  if (isCurrentYear) {
    return base;
  }

  return `${base}, ${date.getFullYear()}`;
};

/**
 * Trasnforme une date-heure en heure au format HH:MM avec une option pour le système AM-PM
 * Exemple : 12-01-2026T09:30:00:00.000 => 09:30
 *
 * @param {Date} date - l'objet date à transformer en heure
 * @param {boolean} amPM - détermine si l'heure doit avoir le format AM-PM
 * @returns l'heure correspondant à celle contenue dans la date au format HH:MM (AM/PM)
 */
export const formatTime = (date: Date, amPm: boolean): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: amPm,
  });
};

/**
 * Vérifie si une date correspond à la date d'ajourd'hui
 *
 * @param {Date} input - la date qu'on veut vérifier
 * @returns true si oui sinon false
 */
export function isToday(input: Date): boolean {
  const today = new Date();

  return (
    input.getFullYear() === today.getFullYear() &&
    input.getMonth() === today.getMonth() &&
    input.getDate() === today.getDate()
  );
}
