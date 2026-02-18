import { Pagination } from "@/types/Pagination";

/**
 * Réponse à envoyer en cas de succès d'une requête
 * @param {any} data - les données à retourner
 * @param {string} message - le message à envoyer
 * @returns - un json contenant le status, les données et le message
 */
export const successResponse = (
  data: any,
  message?: string,
  pagination?: Pagination,
) => {
  const response: any = {
    success: true,
    data,
  };

  if (message) response.message = message;
  if (pagination) response.pagination = pagination;

  return response;
};

/**
 * Réponse à envoyer en cas d'erreur d'une requête
 * @param {string} code - code de l'erreur
 * @param {string} message - le message à envoyer
 * @param {any} details - informations supplémentaires
 * @returns - un json contenant le status, le code et le message
 */
export const errorResponse = (
  code: string,
  message: string,
  details?: any,
) => ({
  success: false,
  error: { code, message, details },
});
