import { TaskStatus } from "../../types/Task";
import { ComponentType } from "react";
import {
  CircleHalfIcon,
  CircleIcon,
  CheckCircleIcon,
  LockIcon,
} from "@phosphor-icons/react";

type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

export type StatusMeta = {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: ComponentType<{ size?: number; weight?: IconWeightProps }>;
};

export const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
];

export const TASK_STATUS_META: Record<TaskStatus, StatusMeta> = {
  TODO: {
    label: "À faire",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-gray-300",
    icon: CircleIcon,
  },
  IN_PROGRESS: {
    label: "En cours",
    textColor: "text-blue-600",
    bgColor: "bg-blue-200",
    borderColor: "border-gray-300",
    icon: CircleHalfIcon,
  },
  BLOCKED: {
    label: "Bloqué",
    textColor: "text-red-600",
    bgColor: "bg-red-200",
    borderColor: "border-gray-300",
    icon: LockIcon,
  },
  COMPLETED: {
    label: "Terminé",
    textColor: "text-green-600",
    bgColor: "bg-green-200",
    borderColor: "border-gray-300",
    icon: CheckCircleIcon,
  },
} as const;
