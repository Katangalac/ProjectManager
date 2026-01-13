import { useTaskById } from "@/hooks/queries/task/useTaskById";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import TaskDetails from "../task/TaskDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

type TaskNotificationViewProps = {
  taskId: string;
  notificationType: string;
};

/**Affiche les notifications de type TASK */
export default function TaskNotificationView({
  taskId,
  notificationType,
}: TaskNotificationViewProps) {
  const { data, isError, isLoading } = useTaskById(taskId);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);

  return (
    <div>
      {isLoading && <ProgressSpinner />}

      {!isLoading && (
        <>
          {isError && <UserErrorMessage />}
          {data ? (
            <div className={clsx("flex flex-col gap-2 text-xs")}>
              <div className={clsx("flex flex-col gap-2 p-4")}>
                <span className={clsx("text-left")}>
                  {notificationType === "NEW_TASK"
                    ? "You've been assigned to the task"
                    : "You've been unassigned from the task"}{" "}
                  <strong>"{data.data?.title}"</strong>
                </span>
                <div className={clsx("flex items-center gap-4")}>
                  <button
                    onClick={() => {
                      setDialogTitle(data.data.title);
                      setDialogContent(<TaskDetails task={data.data} />);
                      setShowDialog(true);
                    }}
                    className={clsx(
                      "rounded-sm px-2 py-1 text-white",
                      "border border-gray-300 bg-gray-700",
                      "hover:bg-gray-800"
                    )}
                  >
                    See task
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <NoItems message="Invitation not found!" />
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
          <DialogHeader className={clsx("rounded-t-md bg-sky-500 px-4 py-4")}>
            <DialogTitle className="text-lg text-white">
              {dialogTitle}
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
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
