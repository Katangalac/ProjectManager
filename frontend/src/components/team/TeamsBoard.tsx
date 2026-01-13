import { TeamWithRelations } from "../../types/Team";
import TeamCard from "./TeamCard";
import { clsx } from "clsx";

/**
 * Propriétés du TeamsBoard
 * - teams : la liste des équipes à afficher dans le board
 */
type TeamsBoardProps = {
  teams: TeamWithRelations[];
};

/**
 *Affiche les équipes sous la forme d'un board
 * @param {TeamsBoardProps} param0 - Propriétés du TeamsBoard
 */
export default function TeamsBoard({ teams }: TeamsBoardProps) {
  return (
    <div
      className={clsx(
        teams.length > 3
          ? "grid h-fit w-full grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-x-3 gap-y-3"
          : "flex w-full gap-4"
      )}
    >
      {(!teams || teams.length === 0) && <div>No teams</div>}
      {teams.map((team, index) => (
        <TeamCard key={index} team={team} />
      ))}
    </div>
  );
}
