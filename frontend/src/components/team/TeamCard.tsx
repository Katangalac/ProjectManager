import { clsx } from "clsx";
import { TeamWithRelations } from "../../types/Team";
import TeamActionMenu from "./TeamActionMenu";
import { getAcronymeFromName } from "../../utils/stringUtils";
import { useNavigate } from "react-router-dom";

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
        <div
          className={clsx(
            "flex items-center justify-center rounded-md bg-sky-600 px-3 py-5",
            "h-16 w-fit min-w-16"
          )}
          onClick={() => navigate(`/userTeams/${team.id}`)}
        >
          <span className={clsx("text-lg font-medium text-white")}>
            {getAcronymeFromName(team.name)}
          </span>
        </div>
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
