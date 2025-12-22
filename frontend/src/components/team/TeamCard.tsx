import { clsx } from "clsx";
import { TeamWithRelations } from "../../types/Team";
import TeamActionMenu from "./TeamActionMenu";
import { useNavigate } from "react-router-dom";
import TeamNameAcronym from "./TeamNameAcronym";

type TeamCardProps = {
  team: TeamWithRelations;
};

export default function TeamCard({ team }: TeamCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        "flex h-40 max-h-40 w-52 max-w-52 cursor-pointer flex-col px-4 py-4",
        "gap-5 rounded-md border border-gray-300 shadow-lg hover:brightness-85",
        "dark:border-gray-600 dark:bg-gray-800"
      )}
    >
      <div className={clsx("flex w-full justify-center")}>
        <TeamNameAcronym
          name={team.name}
          onClick={() => navigate(`/userTeams/${team.id}`)}
          className="min-w-16 px-3 py-5"
        />
      </div>
      <div className={clsx("flex w-full items-start justify-between pt-2")}>
        <span
          className={clsx(
            "max-w-36 text-left text-sm font-normal text-wrap text-gray-600"
          )}
        >
          {team.name}
        </span>
        <TeamActionMenu team={team} />
      </div>
    </div>
  );
}
