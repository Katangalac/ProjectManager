import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

type NavItemType = {
  to: string;
  className?: (props: { isActive: boolean }) => string;
  children?: ReactNode;
};

export default function NavLink({ to, className, children }: NavItemType) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <a href={to} className={className ? className({ isActive }) : ""}>
      {children}
    </a>
  );
}
