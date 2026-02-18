import { ProgressSpinner } from "primereact/progressspinner";
import { clsx } from "clsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import PaginationWrapper from "@/components/commons/Pagination";
import { FolderPlus } from "lucide-react";
import ProjectFilterButton from "@/components/project/ProjectFilterButton";
import { SearchProjectsFilter } from "@/types/Project";
import MotionPage from "@/components/commons/MotionPage";

/**
 * Affiche les projets de l'utilisateur
 */
export default function ProjectsPage() {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [projectsFilter, setProjectsFilter] = useState<SearchProjectsFilter>({});
  const { data, isError, isLoading, refetch } = useProjects({
    ...projectsFilter,
    page,
    pageSize,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);
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
    <MotionPage>
      <div className={clsx("flex h-full w-full flex-col items-center justify-center gap-2 p-5")}>
        {isLoading && <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />}
        {!isLoading && (
          <div className={clsx("flex h-full w-full flex-col gap-4")}>
            <div className="flex w-full justify-between">
              <div className="flex h-fit w-fit items-center gap-4">
                <InlineSelector value={viewMode} options={viewModeOptions} onChange={setViewMode} />
                <button
                  onClick={() => setShowDialog(true)}
                  className={clsx(
                    "flex h-fit w-fit cursor-pointer items-center gap-1 px-2 py-2",
                    "focus:ring-2 focus:ring-sky-200 focus:outline-none",
                    "rounded-md border border-sky-500 bg-sky-500 shadow-md hover:bg-sky-600",
                    "text-xs font-medium text-white"
                  )}
                >
                  <PlusIcon className={clsx("size-3 stroke-3")} />
                  Add New
                </button>
              </div>
              <ProjectFilterButton
                projectsFilter={projectsFilter}
                setProjectsFilter={setProjectsFilter}
              />
            </div>
            <div
              className={clsx(
                "flex flex-1 flex-col justify-between gap-4",
                !(data && data.data.length > 0) && "items-center justify-center",
                isError && "justify-start gap-10"
              )}
            >
              {isError && <UserErrorMessage onRetryButtonClick={() => refetch()} />}
              {data && data.data.length > 0 ? (
                <>
                  {viewMode === "list" && <ProjectsTable projects={data.data} />}
                  {viewMode === "card" && (
                    <div
                      className={clsx("grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4")}
                    >
                      {data.data.map((project) => (
                        <ProjectCard key={project.id} project={project} showProgressBar={true} />
                      ))}
                    </div>
                  )}
                  <PaginationWrapper
                    page={page}
                    setPage={setPage}
                    totalItems={totalItems}
                    totalPages={totalPages}
                  />
                </>
              ) : (
                <NoItems
                  message="No projects available!"
                  iconSize="size-15 stroke-1"
                  textStyle="text-lg text-gray-400 font-medium"
                  className="lg:h-80 lg:w-80"
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
                <span className="flex items-center gap-2">
                  <FolderPlus className="stroke-2" />
                  New project
                </span>
              </DialogTitle>
            </DialogHeader>
            <div
              className={clsx(
                "max-h-[80vh] overflow-y-auto rounded-b-md pb-4 pl-4",
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
    </MotionPage>
  );
}
