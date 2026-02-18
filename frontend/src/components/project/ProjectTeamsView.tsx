import { clsx } from "clsx";
import TeamsTable from "../team/TeamTable";
import { useProjectTeams } from "@/hooks/queries/project/useProjectTeams";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import { ReactNode, useState } from "react";
import PaginationWrapper from "../commons/Pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddTeamToProjectForm from "./AddTeamToProjectForm";
import RemoveTeamFromProjectForm from "./RemoveTeamFromProject";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useProjectById } from "@/hooks/queries/project/useProjectById";
import { showError } from "@/utils/toastService";
import { UserGroupIcon } from "@heroicons/react/24/solid";

type ProjectTeamsViewProps = {
  projectId: string;
};

/**
 * Affiche toutes les équipes d'un projet
 */
export default function ProjectTeamsView({ projectId }: ProjectTeamsViewProps) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const { data: project } = useProjectById(projectId);
  const { data, isLoading, isError } = useProjectTeams(projectId, {
    page,
    pageSize,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitleIcon, setDialogTitleIcon] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-4",
        (isLoading || !(data && data.data.length > 0)) && "items-center justify-center pt-5"
      )}
    >
      {/* Sélecteur de mode */}
      <div className="flex w-full items-center justify-start gap-3">
        <button
          onClick={() => {
            if (project) {
              setDialogTitleIcon(
                <div className="relative h-fit w-fit">
                  <UserGroupIcon className="size-6 stroke-2" />
                  <PlusIcon className="absolute -top-2 -right-1 size-3 stroke-3" />
                </div>
              );
              setDialogTitle(`Add new team to this project`);
              setDialogContent(
                <AddTeamToProjectForm
                  project={project.data}
                  onSuccess={() => setShowDialog(false)}
                />
              );
              setShowDialog(true);
            } else {
              showError("Something went wrong while processing your request!");
            }
          }}
          className={clsx(
            "flex h-fit w-fit cursor-pointer items-center gap-1 border border-sky-500 px-2 py-2",
            "focus:ring-2 focus:ring-sky-200 focus:outline-none",
            "rounded-md bg-sky-500 shadow-md hover:bg-sky-600",
            "text-xs font-medium text-white"
          )}
        >
          <PlusIcon className={clsx("size-3 stroke-3")} />
          Add
        </button>
        <button
          onClick={() => {
            if (project) {
              setDialogTitle(`Remove team from this project`);
              setDialogTitleIcon(
                <div className="relative h-fit w-fit">
                  <UserGroupIcon className="size-6 stroke-2" />
                  <MinusIcon className="absolute -top-2 -right-1 size-3 stroke-3" />
                </div>
              );
              setDialogContent(
                <RemoveTeamFromProjectForm
                  project={project.data}
                  onSuccess={() => setShowDialog(false)}
                />
              );
              setShowDialog(true);
            } else {
              showError("Something went wrong while processing your request!");
            }
          }}
          className={clsx(
            "flex h-fit w-fit cursor-pointer items-center gap-1 border border-red-700 px-2 py-2",
            "focus:ring-2 focus:ring-sky-200 focus:outline-none",
            "rounded-md bg-red-700 shadow-md hover:bg-red-800",
            "text-xs font-medium text-white"
          )}
        >
          <MinusIcon className={clsx("size-3 stroke-3")} />
          Remove
        </button>
      </div>
      {isLoading && <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />}

      {isError && <UserErrorMessage />}
      {!isLoading && data && (
        <>
          {data.data.length > 0 ? (
            <>
              <TeamsTable teams={data.data} />
              <PaginationWrapper
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                totalPages={totalPages}
              />
            </>
          ) : (
            <NoItems
              message="No Teams available"
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
              <span className="flex items-center gap-2">
                {dialogTitleIcon}
                {dialogTitle}
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
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
