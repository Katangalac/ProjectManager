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
    <footer
      className={clsx(
        "mt-16 border-t-2 bg-gray-700 p-3 text-gray-200",
        className
      )}
    >
      <div className={clsx("flex flex-col items-center justify-center")}>
        <AppLogo showText={true} />
        <span className={clsx("text-sm font-medium underline")}>
          © {new Date().getFullYear()} ProjectFlow. Tous droits réservés.
        </span>
      </div>
    </footer>
  );
}
