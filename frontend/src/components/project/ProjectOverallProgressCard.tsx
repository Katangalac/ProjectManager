import { Project } from "@/types/Project";
import { clsx } from "clsx";
import { Progress } from "../ui/progress";
import { useProjectCost } from "@/hooks/queries/project/useProjectCost";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";

type ProjectOverallProgressCardProps = {
  project: Project;
};

/**
 * Affiche la progression d'un projet et son cout
 */
export default function ProjectOverallProgressCard({
  project,
}: ProjectOverallProgressCardProps) {
  const { data, isError, isLoading } = useProjectCost(project.id);
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-2",
        "rounded-sm border border-gray-300",
        (isLoading || isError) && "items-center justify-center"
      )}
    >
      <div
        className={clsx(
          "flex w-full items-center justify-start px-2 py-3",
          "rounded-t-sm bg-sky-50"
        )}
      >
        <span className={clsx("text-left text-sm font-medium text-black")}>
          Overall progress
        </span>
      </div>
      {isLoading && <ProgressSpinner />}
      {!isLoading && (
        <>
          {isError ? (
            <UserErrorMessage />
          ) : (
            <div className={clsx("flex w-full flex-col gap-3 p-2")}>
              <div className={clsx("flex w-full flex-col gap-2")}>
                <Progress
                  value={project.progress}
                  className={clsx("[&>div]:bg-sky-500")}
                />
                <span
                  className={clsx(
                    "w-full",
                    "text-left text-[13px] font-medium text-black"
                  )}
                >
                  {project.progress}% completed
                </span>
              </div>

              <div className={clsx("flex w-full flex-col gap-2")}>
                <span className="flex items-baseline gap-1 text-left text-xs text-gray-600">
                  Planned cost :
                  <span className="font-medium text-black">
                    {project.budgetPlanned}
                  </span>
                </span>
                <span className="flex items-baseline gap-1 text-left text-xs text-gray-600">
                  Actual cost :
                  <span className="font-medium text-black">
                    {data?.data || 0}
                  </span>
                </span>
              </div>

              <div className={clsx("flex flex-col gap-[0.5px]")}>
                <span className={clsx("text-left text-[12px] text-gray-600")}>
                  Description
                </span>
                <p
                  className={clsx(
                    "overflow-x-auto text-left text-xs text-black",
                    "[&::-webkit-scrollbar]:w-0.5",
                    "[&::-webkit-scrollbar-track]:bg-gray-300",
                    "[&::-webkit-scrollbar-thumb]:bg-gray-400"
                  )}
                >
                  {project.description}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
