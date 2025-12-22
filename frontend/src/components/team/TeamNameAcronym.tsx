import { clsx } from "clsx";
import { getAcronymeFromName } from "../../utils/stringUtils";
import { cn } from "@/lib/utils";

type TeamNameAcronymProps = {
  name: string;
  textClassName?: string;
  className?: string;
  onClick?: () => void;
};

export default function TeamNameAcronym({
  name,
  onClick,
  className,
  textClassName,
}: TeamNameAcronymProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-sky-600",
        "h-16 w-fit",
        className
      )}
      onClick={onClick}
    >
      <span className={clsx("text-lg font-medium text-white", textClassName)}>
        {getAcronymeFromName(name)}
      </span>
    </div>
  );
}
