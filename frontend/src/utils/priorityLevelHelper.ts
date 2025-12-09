/**
 * Type des informations associées à un niveau de priorité
 *
 * - label : le texte associé au niveau de priorité
 * - style : le style tailwindCss à utiliser pour le niveau de priorité
 */
type PriorityLevelMeta = {
  label: string;
  textStyle: string;
  bgColor: string;
};

/**
 * Contient les informations associées à un niveau de priorité
 */
export const priorityLevelHelper: Record<number, PriorityLevelMeta> = {
  1: {
    label: "Very low",
    textStyle: "text-gray-500",
    bgColor: "bg-gray-200",
  },

  2: {
    label: "Low",
    textStyle: "text-blue-600",
    bgColor: "bg-blue-200",
  },

  3: {
    label: "Medium",
    textStyle: "text-yellow-600",
    bgColor: "bg-yellow-200",
  },

  4: {
    label: "High",
    textStyle: "text-purple-600",
    bgColor: "bg-purple-200",
  },

  5: {
    label: "Very high",
    textStyle: "text-red-600",
    bgColor: "bg-red-200",
  },
};
