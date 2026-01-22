import { useTeamById } from "@/hooks/queries/team/useTeamById";
import { clsx } from "clsx";
import { ProgressSpinner } from "primereact/progressspinner";
import UserErrorMessage from "../commons/UserErrorMessage";
import NoItems from "../commons/NoItems";
import { useNavigate } from "react-router-dom";

type TeamNotificationViewProps = {
  teamId: string;
  notificationType: string;
};

/**Affiche les notifications de type TEAM */
export default function TeamNotificationView({
  teamId,
  notificationType,
}: TeamNotificationViewProps) {
  const { data, isError, isLoading } = useTeamById(teamId);
  const navigate = useNavigate();
  return (
    <div className={clsx(isLoading && "py-5")}>
      {isLoading && (
        <ProgressSpinner className="h-15 sm:h-10" strokeWidth="4" />
      )}

      {!isLoading && (
        <>
          {isError && <UserErrorMessage />}
          {data ? (
            <div className={clsx("flex flex-col gap-2 text-xs")}>
              <div className={clsx("flex flex-col gap-2 p-4")}>
                <span className={clsx("text-left")}>
                  {notificationType === "NEW_TEAM" &&
                    "You've been added to the team"}
                  {notificationType === "REMOVE_FROM_TEAM" &&
                    "You've been removed from the team"}
                  {notificationType === "NEW_TEAM_ROLE" &&
                    "You've been given a new role in the the team"}{" "}
                  <strong>"{data.data.name}"</strong>
                </span>
                <div
                  className={clsx(
                    "flex items-center gap-4",
                    notificationType === "REMOVE_FROM_TEAM" && "hidden"
                  )}
                >
                  <button
                    onClick={() => {
                      navigate(`/userTeams/${data.data.id}`);
                    }}
                    className={clsx(
                      "rounded-sm px-2 py-1 text-white",
                      "border border-gray-300 bg-gray-700",
                      "hover:bg-gray-800"
                    )}
                  >
                    See team
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <NoItems message="Invitation not found!" />
          )}
        </>
      )}
    </div>
  );
}
