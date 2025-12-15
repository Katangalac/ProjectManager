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

export default function ProjectPage() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className={clsx("flex min-h-screen items-center justify-center")}>
      {/* <ProgressSpinner strokeWidth="5" animationDuration=".5s" /> */}
      <DatePicker value={date} onChange={setDate} />
    </div>
  );
}
