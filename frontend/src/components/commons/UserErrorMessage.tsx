import { cn } from "@/lib/utils";
import { SmileyXEyesIcon } from "@phosphor-icons/react";

/**
 * Propriétés du UserErrorMessage
 *
 *  - message: message à afficher
 *  - iconSize: taille de l'icone
 *  - iconWeight: type de l'icone
 *  - textStyle: style de texte
 *  - hidIcon: afficher ou masquer l'icone
 *  - className: style du composant
 *  - onRetryButtonClick: fonction à appeller en cas de click sur le bouton retry
 */
type UserErrorMessageProps = {
  message?: string;
  iconSize?: string;
  iconWeight?: "regular" | "thin" | "bold" | "duotone" | "fill" | "light";
  textStyle?: string;
  hideIcon?: boolean;
  className?: string;
  onRetryButtonClick?: () => void;
};

/**
 * Affiche un message d'erreur
 * @param {UserErrorMessageProps} param0 - propriétés du composant
 */
export default function UserErrorMessage({
  message = "Oops! Something went wrong",
  iconSize = "size-15 stroke-1",
  textStyle = "text-gray-400",
  className = "",
  hideIcon = false,
  iconWeight = "fill",
  onRetryButtonClick,
}: UserErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
        textStyle
      )}
    >
      <SmileyXEyesIcon
        weight={iconWeight}
        className={cn(iconSize, hideIcon ? "hidden" : "")}
      />
      <span>{message}</span>
      <button
        onClick={onRetryButtonClick}
        className={cn(
          "h-fit w-fit px-3 py-1",
          "rounded-sm border border-gray-300 hover:bg-gray-100",
          !onRetryButtonClick && "hidden"
        )}
      >
        Retry
      </button>
    </div>
  );
}
