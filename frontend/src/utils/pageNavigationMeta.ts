import { ComponentType } from "react";
import { HandWavingIcon } from "@phosphor-icons/react";
/**
 * Valeur attendu comme "weight" des icônes
 */
type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

type pageLocationMeta = {
  title: string;
  message?: string;
  icone?: ComponentType<{ size?: number; weight?: IconWeightProps }>;
  iconeColor?: string;
};

export const getPageNavigationMeta = (): Record<string, pageLocationMeta> => {
  return {
    "/dashboard": {
      title: "Dashboard",

      message: `Welcome back! Here's your latest snapshot`,
      icone: HandWavingIcon,
      iconeColor: "text-yellow-600",
    },
    "/projects": {
      title: "My Projets",
    },
    "/userTasks": {
      title: "My Tasks",
    },
    "/profile": {
      title: "Profile",
    },
  };
};
