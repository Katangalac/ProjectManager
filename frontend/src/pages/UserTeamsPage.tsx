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

export default function UserTeamsPage() {
  const {
    data: teams = [],
    isLoading: teamsLoading,
    isError: teamsError,
  } = useTeams({ all: true });
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div className="p-4">
      <div
        className={clsx(
          "flex min-w-full flex-col items-center justify-start",
          "bg-white",
          "dark:bg-gray-900"
        )}
      >
        <div className="mb-4 flex w-full items-center justify-start">
          <button
            title="New team"
            onClick={() => setShowDialog(true)}
            className={clsx(
              "flex h-fit w-fit cursor-pointer items-center gap-1 px-2 py-3",
              "focus:ring-2 focus:ring-sky-200 focus:outline-none",
              "rounded-md bg-sky-600 hover:bg-sky-700",
              "text-xs font-medium text-white"
            )}
          >
            <PlusIcon className={clsx("size-3 stroke-3")} />
            Add New
          </button>
        </div>
        {teamsError && <div>An error occur while loading user teams</div>}
        {teamsLoading && (
          <div>
            <ProgressSpinner />
          </div>
        )}
      </div>
      {!teamsLoading && <TeamsBoard teams={teams} />}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white"
          )}
        >
          <DialogHeader className="rounded-t-md bg-sky-600 px-4 py-4">
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
