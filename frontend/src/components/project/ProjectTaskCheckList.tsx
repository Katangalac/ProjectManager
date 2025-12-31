import { TaskWithRelations } from "@/types/Task";
import { CircleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { Inbox } from "lucide-react";

type ProjectTaskCheckListProps = {
  tasks: TaskWithRelations[];
};

export default function ProjectTaskCheckList({
  tasks,
}: ProjectTaskCheckListProps) {
  return (
    <div
      className={clsx(
        "flex h-[80%] w-full flex-col rounded-sm border border-gray-300"
      )}
    >
      {/**Header */}
      <div
        className={clsx(
          "flex h-fit w-full items-center justify-start px-2 py-3",
          "rounded-t-sm bg-sky-50"
        )}
      >
        <span className={clsx("text-left text-sm font-medium text-black")}>
          Tasks check list
        </span>
      </div>

      <div className={clsx("flex flex-1 flex-col gap-3 overflow-hidden")}>
        {/**Content wrapper */}
        <div className="flex w-full flex-1 flex-col">
          {tasks.length > 0 ? (
            <div
              className={clsx(
                "flex-1 overflow-y-auto px-2",
                "[&::-webkit-scrollbar]:w-0"
              )}
            >
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={clsx(
                    "flex h-fit w-full items-center gap-1 py-3",
                    "border-b border-dotted border-gray-400"
                  )}
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircleIcon
                      weight="fill"
                      className={clsx(
                        "size-4 stroke-1 text-green-500",
                        "cursor-pointer"
                      )}
                    />
                  ) : (
                    <CircleIcon
                      weight="regular"
                      className={clsx(
                        "size-4 stroke-1 text-gray-500",
                        "cursor-pointer"
                      )}
                    />
                  )}
                  <span
                    className={clsx(
                      "line-clamp-2 text-left text-sm text-wrap text-black",
                      task.status === "COMPLETED"
                        ? "text-gray-500 line-through"
                        : ""
                    )}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={clsx(
                "flex w-full flex-1 flex-col items-center justify-center gap-2 text-gray-500"
              )}
            >
              <Inbox className={clsx("size-10 stroke-1")} />
              <span>No tasks</span>
            </div>
          )}
        </div>

        {/**Footer */}
        <div className={clsx("h-fit w-full px-2 pb-3")}>
          <button
            className={clsx(
              "flex w-full cursor-pointer justify-center px-2 py-1",
              "rounded-md border border-gray-300",
              "hover:bg-gray-100 hover:text-gray-700",
              "text-sm text-gray-500"
            )}
          >
            See all
          </button>
        </div>
      </div>
    </div>
  );
}
