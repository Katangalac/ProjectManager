import { z } from "zod"

/**
 * Schéma pour valider l'id passé en paramètre
 * S'assure que l'id est un uuid 
 */
export const idParamSchema = z.object({
  id: z.uuid("ID invalide"),
});