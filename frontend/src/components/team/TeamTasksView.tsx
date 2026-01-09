import { useState } from "react";
import { clsx } from "clsx";
import TasksTable from "../task/TasksTable";
import { useTeamTasks } from "@/hooks/queries/team/useTeamTasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TASKFORM_DEFAULT_VALUES } from "../../lib/constants/task";
import TaskForm from "../task/TaskForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";

type TeamTasksViewProps = {
  teamId: string;
};

/**
 * Page d'affichage des tâches de l'utilisateur courant
 */
export default function TeamTasksView({ teamId }: TeamTasksViewProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { data, isLoading, isError } = useTeamTasks(teamId, {
    all: true,
  });

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-4 overflow-y-auto",
        (isLoading || !(data && data.length > 0)) &&
          "items-center justify-center",
        isError && "items-center"
      )}
    >
      {/* Sélecteur de mode */}
      <div className="flex w-full items-center justify-start gap-3">
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
      {isLoading && <ProgressSpinner />}

      {isError && <UserErrorMessage />}
      {data && (
        <>
          {data.length > 0 ? (
            <TasksTable tasks={data} />
          ) : (
            <NoItems
              message="No tasks available"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
              className="h-80 w-80 rounded-full bg-sky-50"
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
              defaultValues={{ ...TASKFORM_DEFAULT_VALUES, teamId }}
              onSuccess={() => setShowDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
