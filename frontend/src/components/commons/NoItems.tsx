import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { ReactNode } from "react";

type NoItemsProps = {
  message?: string;
  iconSize?: string;
  textStyle?: string;
  hideIcon?: boolean;
  className?: string;
  icon?: ReactNode;
};

export default function NoItems({
  message = "No items",
  iconSize = "size-9 stroke-1",
  textStyle = "text-gray-400",
  className = "",
  icon,
  hideIcon = false,
}: NoItemsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
        textStyle
      )}
    >
      {!hideIcon && <>{icon ? { icon } : <Inbox className={cn(iconSize)} />}</>}

      <span>{message}</span>
    </div>
  );
}
