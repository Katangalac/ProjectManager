import { ProgressSpinner } from "primereact/progressspinner";
import { clsx } from "clsx";
import { Dialog } from "primereact/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import DatePicker from "@/components/ui/DatePicker";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";

export default function ProjectPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={clsx("flex min-h-screen items-center justify-center")}>
      <ContextMenu>
        <ContextMenuTrigger>Right click</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
