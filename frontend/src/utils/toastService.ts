import { toastStyle } from "./toastStyle";
import { toast } from "sonner";

/**
 * Affiche un toast de succès avec un message
 * @param {string} message - le message du texte
 * @param duration - la durée d'affichage du toast
 */
export const showSuccess = (message: string, duration: number = 10000) => {
  toast.success(message, { style: toastStyle["soft-success"], duration });
};

/**
 * Affiche un toast d'erreur avec un message
 * @param {string} message - le message du texte
 * @param duration - la durée d'affichage du toast
 */
export const showError = (message: string, duration: number = 10000) => {
  toast.error(message, { style: toastStyle["soft-error"], duration });
};

/**
 * Affiche un toast d'information avec un message
 * @param {string} message - le message du texte
 * @param duration - la durée d'affichage du toast
 */
export const showInfo = (message: string, duration: number = 10000) => {
  toast.info(message, { style: toastStyle["soft-info"], duration });
};

/**
 * Affiche un toast d'avertissement avec un message
 * @param {string} message - le message du texte
 * @param duration - la durée d'affichage du toast
 */
export const showWarning = (message: string, duration: number = 10000) => {
  toast.warning(message, { style: toastStyle["soft-warning"], duration });
};
