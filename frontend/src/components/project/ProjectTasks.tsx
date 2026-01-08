import { TaskWithRelations } from "@/types/Task";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";
import { useState } from "react";
import { dateToLongString } from "@/utils/dateUtils";
import UserProfilePhoto from "../profile/UserProfilePhoto";

type ProjectTasksProps = {
  tasks: TaskWithRelations[];
  onSeeMore?: () => void;
};

export default function ProjectTasks({ tasks, onSeeMore }: ProjectTasksProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-2 rounded-sm border border-gray-300"
      )}
    >
      <div
        className={clsx(
          "flex h-fit w-full items-center justify-between px-2 py-3",
          "rounded-t-sm bg-sky-50"
        )}
      >
        <span className={clsx("text-left text-sm font-medium text-black")}>
          Tasks
        </span>
        <div className={clsx("flex gap-2")}>
          <button
            title="Previous"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className={clsx(
              "h-fit w-fit cursor-pointer p-1",
              "rounded-sm border border-gray-300 bg-white",
              "hover:bg-sky-100"
            )}
          >
            <ChevronLeftIcon className={clsx("size-3 stroke-1 text-black")} />
          </button>
          <button
            title="Next"
            disabled={currentIndex >= tasks.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className={clsx(
              "h-fit w-fit cursor-pointer p-1",
              "rounded-sm border border-gray-300 bg-white",
              "hover:bg-sky-100"
            )}
          >
            <ChevronRightIcon className={clsx("size-3 stroke-1 text-black")} />
          </button>
        </div>
      </div>
      <div
        className={clsx("flex h-full w-full flex-col justify-between gap-4")}
      >
        <div
          className={clsx(
            "flex flex-1 flex-col px-2",
            "overflow-y-auto",
            "[&::-webkit-scrollbar]:w-0",
            "[&::-webkit-scrollbar-track]:bg-neutral-200",
            "[&::-webkit-scrollbar-thumb]:bg-neutral-300"
          )}
        >
          {tasks.length >= 1 ? (
            <div className={clsx("flex h-full w-full flex-col gap-3")}>
              <div className={clsx("flex flex-col gap-[0.5px]")}>
                <span className={clsx("text-left text-[10px] text-gray-600")}>
                  Task name
                </span>
                <span
                  className={clsx("text-left text-xs font-medium text-black")}
                >
                  {tasks[currentIndex]?.title}
                </span>
              </div>

              <div className={clsx("flex gap-6")}>
                <div className={clsx("flex max-w-20 flex-col gap-[0.5px]")}>
                  <span className={clsx("text-left text-[10px] text-gray-600")}>
                    Assigned to
                  </span>
                  <div
                    className={clsx(
                      "flex -space-x-2",
                      "overflow-x-auto",
                      "[&::-webkit-scrollbar]:w-0"
                    )}
                  >
                    {tasks[currentIndex]?.assignedTo?.map((user) => (
                      <UserProfilePhoto
                        key={user.user.id}
                        userId={user.user.id}
                        imageUrl={user.user.imageUrl}
                        username={user.user.userName}
                        email={user.user.email}
                        className="ring-1 ring-white"
                        size="h-6 w-6"
                        imagefallback={
                          user.user.firstName && user.user.lastName
                            ? `${user.user.firstName[0].toUpperCase() + user.user.lastName[0].toUpperCase()}`
                            : undefined
                        }
                        imageClassName="text-xs"
                      />
                    ))}
                    {tasks[currentIndex]?.assignedTo?.length === 0 && (
                      <span className={clsx("text-left text-xs")}>None</span>
                    )}
                  </div>
                </div>

                <div className={clsx("flex flex-col gap-[0.5px]")}>
                  <span className={clsx("text-left text-[10px] text-gray-600")}>
                    Deadline
                  </span>
                  <span className={clsx("text-left text-xs text-black")}>
                    {dateToLongString(new Date(tasks[currentIndex]?.deadline))}
                  </span>
                </div>
              </div>

              <div className={clsx("flex flex-col gap-[0.5px]")}>
                <span className={clsx("text-left text-[10px] text-gray-600")}>
                  Description
                </span>
                <p
                  className={clsx(
                    "max-h-10 overflow-y-visible text-left text-xs text-black",
                    "[&::-webkit-scrollbar]:w-0.5",
                    "[&::-webkit-scrollbar-track]:bg-gray-300",
                    "[&::-webkit-scrollbar-thumb]:bg-gray-400"
                  )}
                >
                  {tasks[currentIndex]?.description}
                </p>
              </div>
            </div>
          ) : (
            <NoItems
              message="No tasks available"
              textStyle="text-sm font-medium text-gray-400"
            />
          )}
        </div>
        <div className={clsx("h-fit w-full px-2 pb-3")}>
          <button
            onClick={onSeeMore}
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
