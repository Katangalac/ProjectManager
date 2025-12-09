import { TaskStatus, Task } from "../../types/Task";
import { ComponentType } from "react";
import {
  CircleHalfIcon,
  CircleIcon,
  CheckCircleIcon,
  LockIcon,
} from "@phosphor-icons/react";

/**
 * Valeur attendu comme "weight" des icônes
 */
type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

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
  icon: ComponentType<{ size?: number; weight?: IconWeightProps }>;
};

/**
 * Liste composées des status possibles pour une tâche
 */
export const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
];

/**
 * Informations associées à chaque status d'une tâche
 */
export const TASK_STATUS_META: Record<TaskStatus, StatusMeta> = {
  TODO: {
    label: "To-do",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-gray-300",
    icon: CircleIcon,
  },
  IN_PROGRESS: {
    label: "In progress",
    textColor: "text-blue-600",
    bgColor: "bg-blue-200",
    borderColor: "border-gray-300",
    icon: CircleHalfIcon,
  },
  BLOCKED: {
    label: "Blocked",
    textColor: "text-red-600",
    bgColor: "bg-red-200",
    borderColor: "border-gray-300",
    icon: LockIcon,
  },
  COMPLETED: {
    label: "Completed",
    textColor: "text-green-600",
    bgColor: "bg-green-200",
    borderColor: "border-gray-300",
    icon: CheckCircleIcon,
  },
} as const;

/**
 * Valeur par défaut du formulaire de création d'une tâche
 */
export const TASKFORM_DEFAULT_VALUES: Partial<Task> = {
  creatorId: null,
  title: "",
  projectId: null,
  teamId: null,
  status: "TODO",
  priorityLevel: 3,
  cost: 0,
  progress: 0,
  startedAt: new Date(),
  deadline: new Date(),
  description: "",
};
