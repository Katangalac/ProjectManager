import { useState } from "react";
import { clsx } from "clsx";
import TasksTable from "../task/TasksTable";
import ProjectTaskCheckList from "../project/ProjectTaskCheckList";
import { useProjectTasks } from "@/hooks/queries/project/useProjectTasks";
import { InlineSelector } from "../commons/InlineSelector";
import { NumberedListIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TASKFORM_DEFAULT_VALUES } from "../../lib/constants/task";
import TaskForm from "../task/TaskForm";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import PaginationWrapper from "../commons/Pagination";
import { ClipboardPlus, PlusIcon } from "lucide-react";
import { SearchTasksFilter } from "@/types/Task";
import TaskFilterButton from "../task/TaskFilterButton";

type ProjectTasksViewProps = {
  projectId: string;
};

/**
 * Affiches toutes les taches d'un projet
 */
export default function ProjectTasksView({ projectId }: ProjectTasksViewProps) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "checklist">("table");
  const [showDialog, setShowDialog] = useState(false);
  const [tasksFilter, setTasksFilter] = useState<SearchTasksFilter>({});
  const { data, isLoading, isError } = useProjectTasks(projectId, {
    ...tasksFilter,
    page,
    pageSize,
  });
  const viewModeOptions = [
    {
      label: "List",
      value: "table",
      icon: <NumberedListIcon className={clsx("size-4 stroke-2")} />,
    },
    {
      label: "Check-List",
      value: "checklist",
      icon: <NumberedListIcon className={clsx("size-4 stroke-2")} />,
    },
  ];

  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-4 pb-4",
        (isLoading || !(data && data.data.length > 0)) && "items-center justify-center"
      )}
    >
      {/* Sélecteur de mode */}
      <div className="flex w-full justify-between">
        <div className="flex w-full items-center justify-start gap-3">
          <InlineSelector value={viewMode} options={viewModeOptions} onChange={setViewMode} />
          <button
            onClick={() => setShowDialog(true)}
            className={clsx(
              "flex h-fit w-fit cursor-pointer items-center gap-1 border border-sky-500 px-2 py-2",
              "focus:ring-2 focus:ring-sky-200 focus:outline-none",
              "rounded-md bg-sky-500 shadow-md hover:bg-sky-600",
              "text-xs font-medium text-white"
            )}
          >
            <PlusIcon className={clsx("size-3 stroke-3")} />
            Add New
          </button>
        </div>
        <TaskFilterButton tasksFilter={tasksFilter} setTasksFilter={setTasksFilter} />
      </div>

      {isLoading && <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />}

      {isError && <UserErrorMessage />}
      {data && (
        <>
          {data.data.length > 0 ? (
            <>
              {viewMode === "table" && <TasksTable tasks={data.data} />}
              {viewMode === "checklist" && (
                <ProjectTaskCheckList tasks={data.data} hideSeeAllButton={true} />
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
              message="No tasks available"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
            />
          )}
        </>
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
              <div className="flex items-center gap-2">
                <ClipboardPlus className="size-6 stroke-2" />
                New Task
              </div>
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
            <TaskForm
              isUpdateForm={false}
              disableStatusInput={false}
              defaultValues={{ ...TASKFORM_DEFAULT_VALUES, projectId }}
              onSuccess={() => setShowDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
