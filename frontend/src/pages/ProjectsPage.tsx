import { ProgressSpinner } from "primereact/progressspinner";
import { clsx } from "clsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { InlineSelector } from "@/components/commons/InlineSelector";
import { useProjects } from "@/hooks/queries/project/useProjects";
import ProjectsTable from "@/components/project/ProjectTable";
import ProjectForm from "@/components/project/ProjectForm";
import { PROJECTFORM_DEFAULT_VALUES } from "@/lib/constants/project";
import { PlusIcon } from "@heroicons/react/24/outline";
import { NumberedListIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import ProjectCard from "@/components/project/ProjectCard";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

/**
 * Affiche les projets de l'utilisateur
 */
export default function ProjectsPage() {
  const { data = [], isError, isLoading, refetch } = useProjects({ all: true });
  const [showDialog, setShowDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const viewModeOptions = [
    {
      label: "Overview",
      value: "card",
      icon: <Squares2X2Icon className={clsx("size-4")} />,
    },
    {
      label: "List",
      value: "list",
      icon: <NumberedListIcon className={clsx("size-4 stroke-2")} />,
    },
  ];
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col items-center justify-center gap-2 p-5"
      )}
    >
      {isLoading && <ProgressSpinner />}
      {!isLoading && (
        <div className={clsx("flex h-full w-full flex-col gap-4")}>
          <div className="flex h-fit w-fit items-center gap-4">
            <InlineSelector
              value={viewMode}
              options={viewModeOptions}
              onChange={setViewMode}
            />
            <button
              onClick={() => setShowDialog(true)}
              className={clsx(
                "flex h-fit w-fit cursor-pointer items-center gap-1 px-2 py-2",
                "focus:ring-2 focus:ring-sky-200 focus:outline-none",
                "rounded-md border border-sky-600 bg-sky-500 hover:bg-sky-600",
                "text-xs font-medium text-white"
              )}
            >
              <PlusIcon className={clsx("size-3 stroke-3")} />
              Add New
            </button>
          </div>

          <div
            className={clsx(
              "flex flex-1 flex-col justify-between gap-4",
              !(data && data.length > 0) && "items-center justify-center",
              isError && "justify-start gap-10"
            )}
          >
            {isError && (
              <UserErrorMessage onRetryButtonClick={() => refetch()} />
            )}
            {data?.length > 0 ? (
              <>
                {viewMode === "list" && <ProjectsTable projects={data} />}
                {viewMode === "card" && (
                  <div
                    className={clsx(
                      "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4"
                    )}
                  >
                    {data.map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NoItems
                message="No projects available!"
                iconSize="size-15 stroke-1"
                textStyle="text-lg text-gray-400 font-medium"
                className="h-80 w-80 rounded-full bg-sky-50"
              />
            )}
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className="rounded-t-md bg-sky-500 px-4 py-4">
            <DialogTitle className="text-lg text-white">
              New project
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            <ProjectForm
              isUpdateForm={false}
              defaultValues={PROJECTFORM_DEFAULT_VALUES}
              onSuccess={() => setShowDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
