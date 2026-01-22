import { clsx } from "clsx";
import ProjectsTable from "../project/ProjectTable";
import { useTeamProjects } from "@/hooks/queries/team/useTeamProjects";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import { useState } from "react";
import PaginationWrapper from "../commons/Pagination";
import { SearchProjectsFilter } from "@/types/Project";
import ProjectFilterButton from "../project/ProjectFilterButton";

type TeamProjectsViewProps = {
  teamId: string;
};

/**
 * Affiche les projets d'une équipe
 */
export default function TeamProjectsView({ teamId }: TeamProjectsViewProps) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [projectsFilter, setProjectsFilter] = useState<SearchProjectsFilter>(
    {}
  );
  const { data, isLoading, isError } = useTeamProjects(teamId, {
    ...projectsFilter,
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
        isError && "items-center justify-center pt-5"
      )}
    >
      <div className="flex w-full justify-between">
        <ProjectFilterButton
          projectsFilter={projectsFilter}
          setProjectsFilter={setProjectsFilter}
        />
      </div>
      {/* Sélecteur de mode */}
      {isLoading && (
        <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
      )}

      {!isLoading && isError && <UserErrorMessage />}
      {data && (
        <>
          {data.data.length > 0 ? (
            <>
              <ProjectsTable projects={data.data} />
              <PaginationWrapper
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                totalPages={totalPages}
              />
            </>
          ) : (
            <NoItems
              message="No projects available"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
            />
          )}
        </>
      )}
    </div>
  );
}
