import UsersTable from "../user/UserTable";
import { useProjectCollaborators } from "@/hooks/queries/project/useProjectCollaborators";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import PaginationWrapper from "../commons/Pagination";
import { useState } from "react";

type ProjectCollaboratorsTableProps = {
  projectId: string;
};

/**
 * Page d'affichage des collaborateurs dans une table
 */
export default function ProjectCollaboratorsTable({
  projectId,
}: ProjectCollaboratorsTableProps) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProjectCollaborators(projectId, {
    page,
    pageSize,
  });
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalItems / pageSize);

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
      {data && (
        <>
          {data.data.length > 0 ? (
            <>
              <UsersTable users={data.data || []} title="Collaborators" />
              <PaginationWrapper
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                totalPages={totalPages}
              />
            </>
          ) : (
            <NoItems
              message="No collaborators yet"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
              className="h-80 w-80 rounded-full bg-sky-50"
            />
          )}
        </>
      )}
    </div>
  );
}
