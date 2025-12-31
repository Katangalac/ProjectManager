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
import { ViewColumnsIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * Page d'affichage des tâches de l'utilisateur courant
 */
export default function UserTasksPage() {
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
  const { data, isLoading, isError } = useTasks({ all: true });

  return (
    <div className="h-full p-4">
      {/* Sélecteur de mode */}
      <div className="mb-4 flex items-center justify-start gap-3">
        <InlineSelector
          value={viewMode}
          options={viewModeOptions}
          onChange={setViewMode}
        />
        <button
          title="New task"
          onClick={() => setShowDialog(true)}
          className={clsx(
            "flex h-fit w-fit cursor-pointer items-center gap-1 border border-sky-600 px-2 py-3",
            "focus:ring-2 focus:ring-sky-200 focus:outline-none",
            "rounded-md bg-sky-600 hover:bg-sky-700",
            "text-xs font-medium text-white"
          )}
        >
          <PlusIcon className={clsx("size-3 stroke-3")} />
          Add New
        </button>
      </div>

      {isLoading && <ProgressSpinner />}

      {isError && (
        <div>
          <span className={clsx("text-red-700")}>
            Erreur lors de la récupérations tâches
          </span>
        </div>
      )}

      {viewMode === "board" && <TasksBoard tasks={data?.data || []} />}
      {viewMode === "kanban" && <TasksKanban tasks={data?.data || []} />}
      {viewMode === "table" && <TasksTable tasks={data?.data || []} />}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className="rounded-t-md bg-sky-600 px-4 py-4">
            <DialogTitle className="text-lg text-white">New task</DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
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
  );
}
