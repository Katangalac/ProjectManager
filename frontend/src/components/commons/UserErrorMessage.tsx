import { cn } from "@/lib/utils";
import { SmileyXEyesIcon } from "@phosphor-icons/react";

type UserErrorMessageProps = {
  message?: string;
  iconSize?: string;
  iconWeight?: "regular" | "thin" | "bold" | "duotone" | "fill" | "light";
  textStyle?: string;
  hideIcon?: boolean;
  className?: string;
  onRetryButtonClick?: () => void;
};

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
