/**
 * Type des informations associées à un niveau de priorité
 *
 * - label : le texte associé au niveau de priorité
 * - style : le style tailwindCss à utiliser pour le niveau de priorité
 */
type PriorityLevelItems = {
  label: string;
  style: string;
};

/**
 * Contient les informations associées à un niveau de priorité
 */
export const priorityLevelHelper: Record<number, PriorityLevelItems> = {
  1: {
    label: "Très basse",
    style: "text-gray-600",
  },

  2: {
    label: "Basse",
    style: "text-green-600",
  },

  3: {
    label: "Normal",
    style: "text-yellow-600",
  },

  4: {
    label: "Urgent",
    style: "text-purple-600",
  },

  5: {
    label: "Critique",
    style: "text-red-600",
  },
};
