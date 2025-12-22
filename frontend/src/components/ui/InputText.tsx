import { forwardRef, ReactNode } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

/**
 *
 */
interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode; // Peut être n'importe quoi maintenant!
  iconPosition?: "left" | "right";
  label?: string;
  onIconClick?: () => void;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      error,
      icon,
      iconPosition = "left",
      onIconClick,
      className,
      label,
      ...props
    },
    ref
  ) => {
    const isLeft = iconPosition === "left";
    const isRight = iconPosition === "right";
    const hasIcon = !!icon;

    return (
      <div className="w-full">
        <div className={clsx("mb-1 flex w-full items-center justify-start")}>
          {label && (
            <label
              className={clsx(
                "block text-left font-medium text-black",
                "text-sm dark:text-white"
              )}
            >
              {label}
            </label>
          )}
        </div>
        <div className="relative">
          {icon && isLeft && (
            <div
              className={clsx(
                "absolute top-1/2 left-3 -translate-y-1/2 text-gray-400",
                onIconClick
                  ? "cursor-pointer hover:text-gray-600"
                  : "pointer-events-none"
              )}
              onClick={onIconClick}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type="text"
            className={cn(
              "w-full py-2",
              hasIcon && isLeft && "pr-4 pl-10",
              hasIcon && isRight && "pr-10 pl-4",
              !hasIcon && "px-4",
              "rounded-sm border bg-white",
              "text-black",
              "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
              "hover:border-sky-400",
              "dark:bg-gray-800 dark:text-white",
              error ? "border-red-500" : "border-gray-300",
              className
            )}
            {...props}
          />

          {icon && isRight && (
            <div
              className={clsx(
                "absolute top-1/2 right-3 -translate-y-1/2 text-gray-400",
                onIconClick
                  ? "cursor-pointer hover:text-gray-600"
                  : "pointer-events-none"
              )}
              onClick={onIconClick}
            >
              {icon}
            </div>
          )}
        </div>
        <div className={clsx("mt-1 flex w-full items-center justify-start")}>
          {error && <p className="text-right text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }
);

InputText.displayName = "InputText";
