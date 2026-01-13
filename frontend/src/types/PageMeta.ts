import { ReactNode } from "react";

/**Type représentant les métadonnées d'une page */
export type PageMeta = {
  title: string;
  message?: string | ReactNode;
  icon?: ReactNode;
};
