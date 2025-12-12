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
        "grid min-h-screen min-w-full grid-cols-1 gap-x-2 gap-y-5 lg:grid-cols-4"
      )}
    >
      {!teams && <div>No teams</div>}
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
