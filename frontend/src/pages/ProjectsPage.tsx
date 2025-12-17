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
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={clsx("flex min-h-screen items-center justify-center")}>
      <button onClick={() => setFlipped(!flipped)}>Flip</button>
      {/* <ProgressSpinner strokeWidth="5" animationDuration=".5s" /> */}
      <div className="flip-card">
        <div className={clsx("flip-card-inner", flipped ? "rotate-y-180" : "")}>
          <div className="flip-card-front h-60 w-60"></div>
          <div className="flip-card-back h-60 w-60">
            <h1>John Doe</h1>
            <p>Architect & Engineer</p>
            <p>We love that guy</p>
          </div>
        </div>
      </div>

      <div className={clsx("h-80 w-80 bg-transparent perspective-[1000px]")}>
        <div
          className={clsx(
            "relative h-full w-full transition-transform duration-800 transform-3d",
            flipped ? "rotate-y-180" : ""
          )}
        >
          <div
            className={clsx(
              "absolute h-full w-full bg-amber-200 text-center backface-hidden"
            )}
          >
            FRONT
          </div>
          <div
            className={clsx(
              "absolute h-full w-full rotate-y-180 bg-sky-200 text-center backface-hidden"
            )}
          >
            BACK
          </div>
        </div>
      </div>
    </div>
  );
}
