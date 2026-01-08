// import { useState } from "react";
import { clsx } from "clsx";
import TeamInvitationsTable from "./TeamInvitationTable";
import { useTeamInvitations } from "@/hooks/queries/team/useTeamInvitations";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { PlusIcon } from "@heroicons/react/24/outline";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";

type TeamInvitationViewProps = {
  teamId: string;
};

/**
 * Page d'affichage des équipes
 */
export default function TeamInvitationsView({
  teamId,
}: TeamInvitationViewProps) {
  const { data, isLoading, isError } = useTeamInvitations(teamId, {
    all: true,
  });

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-4 overflow-y-auto",
        (isLoading || !(data && data.data.length > 0)) &&
          "items-center justify-center pt-5",
        isError && "items-center"
      )}
    >
      {/* Sélecteur de mode */}
      {isLoading && <ProgressSpinner />}

      {isError && <UserErrorMessage />}
      {data && data.data.length > 0 ? (
        <TeamInvitationsTable invitations={data.data} />
      ) : (
        <NoItems
          message="No invitations available"
          iconSize="size-15 stroke-1"
          textStyle="text-lg text-gray-400 font-medium"
          className="h-80 w-80 rounded-full bg-sky-50"
        />
      )}

      {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
      </Dialog> */}
    </div>
  );
}
