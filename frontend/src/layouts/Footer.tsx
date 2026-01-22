import { clsx } from "clsx";
import AppLogo from "../components/commons/AppLogo";

/**
 * Propriétés du Footer
 *
 * - className: classe de style css
 */
type FooterProps = {
  className?: string;
};

/**
 * Footer de l,application
 */
export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={clsx("border-t bg-white p-3 text-gray-500", className)}>
      <div className={clsx("flex flex-col items-center justify-center")}>
        <AppLogo showText={true} />
        <span className={clsx("text-sm font-medium underline")}>
          Copyright © {new Date().getFullYear()} ProjectFlow. All rights
          reserved.
        </span>
      </div>
    </footer>
  );
}
