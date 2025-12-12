import TeamsBoard from "../components/team/TeamsBoard";
import { useTeams } from "../hooks/queries/team/useTeams";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import TeamForm from "../components/team/TeamForm";
import { useState } from "react";
import { TEAMFORM_DEFAULT_VALUES } from "../lib/constants/team";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function UserTeamsPage() {
  const {
    data: teams = [],
    isLoading: teamsLoading,
    isError: teamsError,
  } = useTeams({ all: true });
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
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
              "flex h-fit w-fit cursor-pointer items-center gap-1 p-2",
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
      <Dialog
        header="New team"
        visible={showDialog}
        style={{ width: "40vw" }}
        modal
        onHide={() => setShowDialog(false)}
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white p-5 text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      >
        <TeamForm
          isUpdateForm={false}
          defaultValues={TEAMFORM_DEFAULT_VALUES}
          onSuccess={() => setShowDialog(false)}
        />
      </Dialog>
    </>
  );
}
