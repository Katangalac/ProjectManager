import { User } from "@/types/User";
import UserBasicInfo from "../profile/UserBasicInfo";
import { clsx } from "clsx";
import NoItems from "../commons/NoItems";

type ProjectCollaboratorsProps = {
  collaborators: User[];
  onSeeMore?: () => void;
};

export default function ProjectCollaborators({
  collaborators,
  onSeeMore,
}: ProjectCollaboratorsProps) {
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
          Collaborators
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
            collaborators.length === 0 && "items-center justify-center"
          )}
        >
          {collaborators.map((user) => (
            <div className={clsx("h-fit w-full px-2")}>
              <div className={clsx("w-full py-2", "border-b border-gray-300")}>
                <UserBasicInfo user={user} />
              </div>
            </div>
          ))}

          {collaborators.length === 0 && (
            <NoItems
              message="No collaborators yet"
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
