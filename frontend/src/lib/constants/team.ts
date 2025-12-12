import { Team } from "../../types/Team";
/**
 * Valeur par défaut du formulaire de création d'une équipe
 */
export const TEAMFORM_DEFAULT_VALUES: Partial<Team> = {
  leaderId: null,
  name: "",
  description: "",
};
