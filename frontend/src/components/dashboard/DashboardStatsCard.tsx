import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ReactNode } from "react";

type DashboardStatsCardProps = {
  title: string;
  description: string;
  value: number;
  className?: string;
  iconClassName?: string;
  icon?: ReactNode;
  onSeeMore?: () => void;
};

/**
 * Affiche les nombre de tache et projet par status
 */
export default function DashboardStatsCard({
  title,
  description,
  value,
  className,
  icon,
  iconClassName,
  onSeeMore,
}: DashboardStatsCardProps) {
  return (
    <div className={cn("rounded-lg border-l-4 border-gray-100 shadow-md", className)}>
      <div
        className={cn(
          "flex h-24 w-full justify-between gap-2",
          "rounded-md border border-gray-300 bg-white p-3"
        )}
      >
        <div className="flex h-full flex-col items-start justify-between">
          <div className={clsx("flex items-center justify-between")}>
            <span className={clsx("text-sm font-medium")}>{title}</span>
          </div>
          <div className={clsx("flex items-baseline justify-start gap-2")}>
            <span className={clsx("text-left text-3xl font-bold")}>{value}</span>
            <span className={clsx("text-left text-xs text-gray-500")}>{description}</span>
          </div>
        </div>
        {icon && <div className="flex h-full w-fit items-center justify-center">{icon}</div>}
        <div className="flex h-full items-start justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={clsx(
                  "flex cursor-pointer items-center justify-center rounded-full bg-white p-1",
                  "hover:bg-gray-100",
                  "border border-gray-400"
                )}
                onClick={onSeeMore}
              >
                <ArrowRightIcon
                  className={cn("size-3 text-gray-400", iconClassName)}
                  weight="bold"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>See more</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
