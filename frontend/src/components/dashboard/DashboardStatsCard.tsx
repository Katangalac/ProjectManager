import { clsx } from "clsx";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type DashboardStatsCardProps = {
  title: string;
  description: string;
  value: number;
  onSeeMore?: () => void;
};

/**
 * Affiche les nombre de tache et projet par status
 */
export default function DashboardStatsCard({
  title,
  description,
  value,
  onSeeMore,
}: DashboardStatsCardProps) {
  return (
    <div
      className={clsx(
        "flex h-24 w-full flex-col justify-between gap-2",
        "rounded-md border border-gray-300 bg-white p-3"
      )}
    >
      <div className={clsx("flex items-center justify-between")}>
        <span className={clsx("text-sm text-black")}>{title}</span>
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
              <ArrowRightIcon className="size-3 text-gray-400" weight="bold" />
            </button>
          </TooltipTrigger>
          <TooltipContent>See more</TooltipContent>
        </Tooltip>
      </div>
      <div className={clsx("flex items-baseline justify-start gap-2")}>
        <span className={clsx("text-left text-2xl font-bold text-black")}>
          {value}
        </span>
        <span className={clsx("text-left text-xs text-gray-500")}>
          {description}
        </span>
      </div>
    </div>
  );
}
