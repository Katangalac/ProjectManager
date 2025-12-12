import { ComponentType } from "react";
import { HandWavingIcon } from "@phosphor-icons/react";
/**
 * Valeur attendu comme "weight" des icônes
 */
type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

type pageLocationMeta = {
  title: string;
  message?: string;
  icone?: ComponentType<{
    size?: number;
    weight?: IconWeightProps;
    className?: string;
  }>;
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
    "/userProjects": {
      title: "My Projets",
    },
    "/userTasks": {
      title: "My Tasks",
    },
    "/userTeams": {
      title: "My Teams",
    },
    "/profile": {
      title: "Profile",
    },
    "/calendar": {
      title: "Calendar",
    },
  };
};
