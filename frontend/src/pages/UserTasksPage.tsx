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
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

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

  const { data, isLoading, isError, refetch } = useTasks({ page, pageSize });
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={clsx(
        "flex h-full flex-col items-center justify-center gap-2 p-5"
      )}
    >
      {isLoading && <ProgressSpinner />}
      {!isLoading && (
        <div className="flex h-full w-full flex-col gap-4">
          {/* Sélecteur de mode */}
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
                    <div
                      className={clsx("flex h-fit w-full justify-center pb-4")}
                    >
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              aria-label="Go to first page"
                              size="icon"
                              className="rounded-sm hover:bg-sky-100"
                              onClick={() => setPage(1)}
                            >
                              <ChevronFirstIcon className="size-4" />
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              aria-label="Go to previous page"
                              size="icon"
                              className="rounded-sm hover:bg-sky-100"
                              onClick={() =>
                                setPage((prev) => Math.max(1, prev - 1))
                              }
                            >
                              <ChevronLeftIcon className="size-4" />
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem>
                            <Select
                              value={String(page)}
                              onValueChange={(value) =>
                                setPage(parseInt(value))
                              }
                              aria-label="Select page"
                            >
                              <SelectTrigger
                                id="select-page"
                                className="w-fit whitespace-nowrap focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                aria-label="Select page"
                              >
                                <SelectValue placeholder="Select page" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {pages.map((page) => (
                                  <SelectItem
                                    key={page}
                                    value={String(page)}
                                    className="transition-colors focus:bg-sky-100"
                                  >
                                    Page {page}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              aria-label="Go to next page"
                              size="icon"
                              className="rounded-sm hover:bg-sky-100"
                              onClick={() =>
                                setPage((prev) =>
                                  Math.min(totalPages, prev + 1)
                                )
                              }
                            >
                              <ChevronRightIcon className="size-4" />
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              aria-label="Go to last page"
                              size="icon"
                              className="rounded-sm hover:bg-sky-100"
                              onClick={() => setPage(totalPages)}
                            >
                              <ChevronLastIcon className="size-4" />
                            </PaginationLink>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </>
                ) : (
                  <NoItems
                    message="No tasks available!"
                    iconSize="size-15 stroke-1"
                    textStyle="text-lg text-gray-400 font-medium"
                    className="h-80 w-80 rounded-full bg-sky-50"
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
                  New task
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
