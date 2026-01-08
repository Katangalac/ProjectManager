import TeamNameAcronym from "./TeamNameAcronym";
import { clsx } from "clsx";
import { Team } from "@/types/Team";
import { cn } from "@/lib/utils";

type TeamBasicInfosProps = {
  team: Team;
  teamAcronymStyle?: string;
  teamAcronymTextStyle?: string;
};

export default function TeamBasicInfos({
  team,
  teamAcronymStyle,
  teamAcronymTextStyle,
}: TeamBasicInfosProps) {
  return (
    <div className={cn("flex h-fit w-fit items-center gap-2")}>
      <TeamNameAcronym
        id={team.id}
        name={team.name}
        className={cn("h-fit w-fit px-2 py-2", teamAcronymStyle)}
        textClassName={cn(
          "text-red-500 text-xs font-medium",
          teamAcronymTextStyle
        )}
      />
      <span className={clsx("text-left text-sm font-medium text-gray-700")}>
        {team.name}
      </span>
    </div>
  );
}
