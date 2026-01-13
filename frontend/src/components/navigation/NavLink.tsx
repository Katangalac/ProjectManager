import { useLocation } from "react-router-dom";
import { ReactNode, ComponentType } from "react";

type IconWeightProps = "fill" | "regular" | "bold" | "duotone" | "light";

/**
 * Type des propriétés d'un NavLink
 * - to : route de la page vers laquelle le NavLink rédirige
 * - className : fonction qui détermine le style du NavLink
 * - children : les éléments qui seront affichés dans le NavLink (icone,text,etc.)
 */
type NaLinkProps = {
  to: string;
  className?: (props: { isActive: boolean }) => string;
  children?: ReactNode;
  icon?: ComponentType<{ size?: number; weight?: IconWeightProps }>;
};

/**
 * Composant permettant de naviguer entre les pages
 * @param {NaLinkProps} param0 - propriétés du NavLink
 */
export default function NavLink({ to, className, children }: NaLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <a href={to} className={className ? className({ isActive }) : ""}>
      {children}
    </a>
  );
}
