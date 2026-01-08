import { ProjectStatus, Project } from "../../types/Project";

/**
 * Liste composées des status possibles pour une tâche
 */
export const PROJECT_STATUSES: ProjectStatus[] = [
  "ACTIVE",
  "PAUSED",
  "BLOCKED",
  "COMPLETED",
  "PLANNING",
];

/**
 * Structure des informations puvant extraites à partir du status d'une tâche
 *
 * - label: le titre/nom du status
 * - textColor: la couleur de texte à utiliser avec tailwindCSS
 * - bgColor: la couleur de background à utiliser avec tailwindCSS
 * - borderColor: la couleur de bordure à utiliser avec tailwindCSS
 * - icon: l'icône associé au status
 */
export type StatusMeta = {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  hexColor: string;
};

/**
 * Informations associées à chaque status d'une tâche
 */
export const PROJECT_STATUS_META: Record<ProjectStatus, StatusMeta> = {
  PLANNING: {
    label: "In planning",
    textColor: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    hexColor: "#E5E7EB",
  },
  PAUSED: {
    label: "Paused",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-gray-300",
    hexColor: "#FEF08A",
  },
  ACTIVE: {
    label: "In progress",
    textColor: "text-sky-500",
    bgColor: "bg-sky-100",
    borderColor: "border-gray-300",
    hexColor: "#BFDBFE",
  },
  BLOCKED: {
    label: "Blocked",
    textColor: "text-red-600",
    bgColor: "bg-red-200",
    borderColor: "border-gray-300",
    hexColor: "#FEE2E2",
  },
  COMPLETED: {
    label: "Completed",
    textColor: "text-green-600",
    bgColor: "bg-green-200",
    borderColor: "border-gray-300",
    hexColor: "#A7F3D0",
  },
} as const;

/**
 * Valeurs par défaut du formulaire de création d'un projet
 */
export const PROJECTFORM_DEFAULT_VALUES: Partial<Project> = {
  creatorId: null,
  title: "",
  progress: 0,
  budgetPlanned: 0,
  startedAt: new Date(),
  deadline: new Date(),
  description: "",
};
