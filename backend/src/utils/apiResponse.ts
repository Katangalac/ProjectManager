/**
 * Réponse à envoyer en cas de succès d'une requête
 * @param {any} data - les données à retourner 
 * @param {string} message - le message à envoyer
 * @returns - un json contenant le status, les données et le message
 */
export const successResponse = (data: any, message?: string) => ({
  success: true,
  data,
  message,
});

/**
 * Réponse à envoyer en cas de succès d'une requête dont les données de retour est une collection
 * @param {any} data - données de type collection
 * @param {string} message - le message à envoyer
 * @param {number} page - la page retournée
 * @param {number} pageSize - le nombre d'items retournés
 * @param {number} totalItems - le total d'items qui pouvez être retournés
 * @returns - un json contenant le status, les données, le message et les informations de pagination
 */
export const successCollectionResponse = (data: any, message?: string, page?:number, pageSize?: number, totalItems?: number) => ({
    success: true,
    data,
    message,
    pagination:{page,pageSize,totalItems}
});

/**
 * Réponse à envoyer en cas d'erreur d'une requête
 * @param {string} code - code de l'erreur
 * @param {string} message - le message à envoyer
 * @param {any} details - informations supplémentaires
 * @returns - un json contenant le status, le code et le message
 */
export const errorResponse = (code: string, message: string, details?: any) => ({
  success: false,
  error: { code, message, details },
});