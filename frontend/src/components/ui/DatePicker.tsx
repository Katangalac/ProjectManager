import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  buttonClassName?: string;
  buttonPlaceholder?: string;
  disabled?: boolean;
};

export default function DatePicker({
  value,
  onChange,
  buttonClassName,
  buttonPlaceholder,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start rounded-sm text-left font-normal shadow-none",
            "border border-gray-300",
            "hover:border-sky-400 hover:bg-white",
            "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
            "text-sm text-black",
            !value && "text-muted-foreground",
            buttonClassName
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span>{buttonPlaceholder ? buttonPlaceholder : "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto" align="start">
        <Calendar
          className={cn("w-80")}
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
