import { z } from "zod";
import { UserRole, UserProvider} from "@prisma/client";

/**
 * Schéma de validation pour le payload du token d'authentification
 */
export const tokenPayloadSchema = z.object({
    sub: z.uuid(),
    email: z.email().max(254, "Email trop long"),
    role: z.enum(UserRole),
    provider: z.enum(UserProvider),
});
