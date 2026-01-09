import TeamsBoard from "../components/team/TeamsBoard";
import { useTeams } from "../hooks/queries/team/useTeams";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import TeamForm from "../components/team/TeamForm";
import { useState } from "react";
import { TEAMFORM_DEFAULT_VALUES } from "../lib/constants/team";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoItems from "@/components/commons/NoItems";
import UserErrorMessage from "@/components/commons/UserErrorMessage";

/**
 * Affiche la liste des équipes d'un utilisateur
 */
export default function UserTeamsPage() {
  const { data = [], isLoading, isError, refetch } = useTeams({ all: true });
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col items-center justify-center gap-2 p-5"
      )}
    >
      {isLoading && <ProgressSpinner />}
      {!isLoading && (
        <div className={clsx("flex h-full w-full flex-col gap-4")}>
          <div className="flex h-fit w-fit items-center gap-4">
            <button
              onClick={() => setShowDialog(true)}
              className={clsx(
                "flex h-fit w-fit cursor-pointer items-center gap-1 px-2 py-2",
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
              !(data && data.length > 0) && "items-center justify-center",
              isError && "justify-start gap-10"
            )}
          >
            {isError && (
              <UserErrorMessage onRetryButtonClick={() => refetch()} />
            )}
            {data && (
              <>
                {data.length > 0 ? (
                  <TeamsBoard teams={data} />
                ) : (
                  <NoItems
                    message="No teams available!"
                    iconSize="size-15 stroke-1"
                    textStyle="text-lg text-gray-400 font-medium"
                    className="h-80 w-80 rounded-full bg-sky-50"
                  />
                )}
              </>
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
            <DialogTitle className="text-lg text-white">New team</DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            <TeamForm
              isUpdateForm={false}
              defaultValues={TEAMFORM_DEFAULT_VALUES}
              onSuccess={() => setShowDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
