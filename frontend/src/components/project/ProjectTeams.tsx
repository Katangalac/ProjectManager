import { TeamWithRelations } from "@/types/Team";
import TeamBasicInfos from "../team/TeamBasicInfos";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";

type ProjectTeamsProps = {
  teams: TeamWithRelations[];
  onSeeMore?: () => void;
};

/**Affiche sommairement les équipes d'un projet */
export default function ProjectTeams({ teams, onSeeMore }: ProjectTeamsProps) {
  return (
    <div
      className={clsx(
        "flex h-full w-full flex-col",
        "rounded-sm border border-gray-300"
      )}
    >
      <div
        className={clsx(
          "flex w-full items-center justify-start px-2 py-3",
          "rounded-t-sm bg-sky-50"
        )}
      >
        <span className={clsx("text-left text-sm font-medium text-black")}>
          Teams
        </span>
      </div>
      <div
        className={clsx("flex h-full w-full flex-col justify-between gap-4")}
      >
        <div
          className={clsx(
            "flex h-full max-h-40 w-full flex-col",
            "overflow-y-auto",
            "[&::-webkit-scrollbar]:w-0",
            "[&::-webkit-scrollbar-track]:bg-neutral-200",
            "[&::-webkit-scrollbar-thumb]:bg-neutral-300",
            teams.length === 0 && "items-center justify-center"
          )}
        >
          {teams.map((team) => (
            <div key={team.id} className={clsx("h-fit w-full px-2")}>
              <div className={clsx("w-full py-2", "border-b border-gray-300")}>
                <TeamBasicInfos team={team} />
              </div>
            </div>
          ))}

          {teams.length === 0 && (
            <NoItems
              message="No teams available"
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
