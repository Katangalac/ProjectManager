import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

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
