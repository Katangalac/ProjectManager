import { useState } from "react";
import { clsx } from "clsx";
import TasksBoard from "../components/task/TasksBoard";
import TasksTable from "../components/task/TasksTable";
import TasksKanban from "../components/task/TasksKanban";
import { useTasks } from "../hooks/queries/task/useTasks";
import { InlineSelector } from "../components/commons/InlineSelector";
import { NumberedListIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TASKFORM_DEFAULT_VALUES } from "../lib/constants/task";
import TaskForm from "../components/task/TaskForm";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";
import { ProgressSpinner } from "primereact/progressspinner";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";
import PaginationWrapper from "@/components/commons/Pagination";
import { ClipboardPlus, PlusIcon } from "lucide-react";
import TaskFilterButton from "@/components/task/TaskFilterButton";
import { SearchTasksFilter } from "@/types/Task";

/**
 * Page d'affichage des tâches de l'utilisateur courant
 */
export default function UserTasksPage() {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"kanban" | "board" | "table">(
    "board"
  );
  const [showDialog, setShowDialog] = useState(false);
  const viewModeOptions = [
    {
      label: "Overview",
      value: "board",
      icon: <Squares2X2Icon className={clsx("size-4")} />,
    },
    {
      label: "Kanban",
      value: "kanban",
      icon: <ViewColumnsIcon className={clsx("size-4 stroke-2")} />,
    },
    {
      label: "List",
      value: "table",
      icon: <NumberedListIcon className={clsx("size-4 stroke-2")} />,
    },
  ];
  const [tasksFilter, setTasksFilter] = useState<SearchTasksFilter>({});
  const { data, isLoading, isError, refetch } = useTasks({
    ...tasksFilter,
    page,
    pageSize,
  });
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);
  //const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={clsx(
        "flex h-full flex-col items-center justify-center gap-2 p-5"
      )}
    >
      {isLoading && (
        <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
      )}
      {!isLoading && (
        <div className="flex h-full w-full flex-col gap-4">
          {/* Sélecteur de mode */}
          <div className="flex w-full justify-between">
            <div className="flex items-center justify-start gap-4">
              <InlineSelector
                value={viewMode}
                options={viewModeOptions}
                onChange={setViewMode}
              />
              <button
                onClick={() => setShowDialog(true)}
                className={clsx(
                  "flex h-fit w-fit cursor-pointer items-center gap-1 border border-sky-600 px-2 py-2",
                  "focus:ring-2 focus:ring-sky-200 focus:outline-none",
                  "rounded-md bg-sky-500 hover:bg-sky-600",
                  "text-xs font-medium text-white"
                )}
              >
                <PlusIcon className={clsx("size-3 stroke-3")} />
                Add New
              </button>
            </div>
            <TaskFilterButton
              tasksFilter={tasksFilter}
              setTasksFilter={setTasksFilter}
            />
          </div>

          <div
            className={clsx(
              "flex flex-1 flex-col justify-between gap-4",
              !(data && data.data.length > 0) && "items-center justify-center",
              isError && "justify-start gap-10"
            )}
          >
            {isError && (
              <UserErrorMessage onRetryButtonClick={() => refetch()} />
            )}
            {data && (
              <>
                {data.data.length > 0 ? (
                  <>
                    {viewMode === "board" && <TasksBoard tasks={data.data} />}
                    {viewMode === "kanban" && <TasksKanban tasks={data.data} />}
                    {viewMode === "table" && <TasksTable tasks={data.data} />}
                    <PaginationWrapper
                      page={page}
                      setPage={setPage}
                      totalItems={totalItems}
                      totalPages={totalPages}
                    />
                  </>
                ) : (
                  <NoItems
                    message="No tasks available!"
                    iconSize="size-15 stroke-1"
                    textStyle="text-lg text-gray-400 font-medium"
                    className="lg:h-80 lg:w-80"
                  />
                )}
              </>
            )}
          </div>

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
                  defaultValues={TASKFORM_DEFAULT_VALUES}
                  onSuccess={() => setShowDialog(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
