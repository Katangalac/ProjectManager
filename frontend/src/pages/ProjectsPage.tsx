import { ProgressSpinner } from "primereact/progressspinner";
import { clsx } from "clsx";

export default function ProjectPage() {
  return (
    <div className={clsx("flex min-h-screen items-center justify-center")}>
      <ProgressSpinner strokeWidth="5" animationDuration=".5s" />
    </div>
  );
}
