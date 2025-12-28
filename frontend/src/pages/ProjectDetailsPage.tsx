import { useParams } from "react-router-dom";
import { useProjectById } from "@/hooks/queries/project/useProjectById";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * Affiche les informations détaillées d'un projet
 */
export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { data, isLoading, isError } = useProjectById(projectId!);
  return (
    <div className={clsx("h-full w-full")}>
      {isLoading ? (
        <ProgressSpinner />
      ) : (
        <div>
          {isError && <div>An error occur while loading the project</div>}
          {data?.title}
        </div>
      )}
    </div>
  );
}
