import { clsx } from "clsx";
import TeamInvitationsTable from "./TeamInvitationTable";
import { useTeamInvitations } from "@/hooks/queries/team/useTeamInvitations";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import { useState } from "react";
import PaginationWrapper from "../commons/Pagination";

type TeamInvitationViewProps = {
  teamId: string;
};

/**
 * Affiche les invitations d'une équipe
 */
export default function TeamInvitationsView({
  teamId,
}: TeamInvitationViewProps) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTeamInvitations(teamId, {
    page,
    pageSize,
  });
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);

  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col gap-4",
        (isLoading || !(data && data.data.length > 0)) &&
          "items-center justify-center pt-5",
        isError && "items-center justify-center"
      )}
    >
      {/* Sélecteur de mode */}
      {isLoading && (
        <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
      )}

      {!isLoading && isError && <UserErrorMessage />}
      {data && (
        <>
          {data.data.length > 0 ? (
            <>
              <TeamInvitationsTable invitations={data.data} />
              <PaginationWrapper
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                totalPages={totalPages}
              />
            </>
          ) : (
            <NoItems
              message="No invitations available"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
            />
          )}
        </>
      )}
    </div>
  );
}
