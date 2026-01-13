import { useState, useRef, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { User, SearchUsersFilter } from "@/types/User";
import UserBasicInfo from "../profile/UserBasicInfo";
import { useUsers } from "@/hooks/queries/user/useUsers";
import { useSendInvitation } from "@/hooks/mutations/invitation/useSendInvitation";
import { useTeamMembers } from "@/hooks/queries/team/useTeamMembers";
import { XCircleIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { showSuccess, showError } from "@/utils/toastService";

/**
 * Propriétés du InviteUser
 *
 *  - senderId : id de celui qui a envoyé l'invitation
 *  - teamId : id de l'équipe concernée par l'invitation
 *  - onSucces : fonction à appeler en cas de succès
 *  - onError : fonction  à appeler en cas d'erreur
 */
type InviteUserProps = {
  senderId: string;
  teamId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

/**
 * Invite un ou plusieurs utilisateurs à rejoindre une équipe
 * @param {InviteUserProps} param0 - propriétés du InviteUser
 */
export default function InviteUser({
  senderId,
  teamId,
  onSuccess,
  onError,
}: InviteUserProps) {
  const [queryParams, setQuery] = useState<SearchUsersFilter>({ all: true });
  const debouncedQuery = useDebounce(queryParams, 300);
  const { data: users, isLoading } = useUsers(debouncedQuery);
  const { data: members } = useTeamMembers(teamId);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const filteredUsers =
    users?.data.filter(
      (user) =>
        !members?.data.some((member) => member.id === user.id) &&
        !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
    ) || [];
  const [message, setMessage] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  //Vérifie/écoute si un click est fait à l'extrieur de la zone de recherche
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { sendInvitation } = useSendInvitation();

  //Ajoute un utilisateur dans liste des users sélectionnés
  function addUser(user: User) {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev : [...prev, user]
    );
  }

  //Retire un utilisateur de la liste des users sélectionnés
  function removeUser(id: string) {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  }

  //Envoie les invitations
  function handleSubmit() {
    try {
      selectedUsers.forEach(async (u) => {
        await sendInvitation({
          senderId: senderId,
          receiverId: u.id,
          teamId: teamId,
          message: message,
        });
      });
      showSuccess("Invitation(s) successfullly sent!");
      onSuccess?.();
    } catch (err: unknown) {
      console.error(err);
      showError("An error occur while sending invitatin(s)!");
      onError?.();
    }
  }

  return (
    <div className="flex min-h-80 flex-col gap-4 pr-4">
      <div className={clsx("flex flex-col gap-0")}>
        <input
          className={clsx(
            "w-full rounded-sm border p-2 outline-none",
            showResults && "rounded-b-none border-b-0"
          )}
          placeholder="Search users..."
          onFocus={() => setShowResults(true)}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(
              value.trim() === ""
                ? { all: false } // aucune recherche
                : {
                    userName: value,
                    firstName: value,
                    lastName: value,
                    all: true,
                  }
            );
          }}
        />
        <div ref={containerRef} className="relative w-full">
          {showResults && (
            <div
              className={clsx(
                "absolute max-h-60 w-full overflow-y-auto rounded border bg-white",
                showResults && "rounded-t-none border-t-0"
              )}
            >
              <div className="mx-4 border-t border-gray-300"></div>
              {isLoading && (
                <div className="p-4 text-sm text-gray-500">Loading...</div>
              )}

              {!isLoading && filteredUsers?.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No users found</div>
              )}

              {!isLoading &&
                filteredUsers?.map((user) => (
                  <button
                    key={user.id}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => addUser(user)}
                  >
                    <UserBasicInfo user={user} />
                  </button>
                ))}
            </div>
          )}
        </div>
        <div
          className={clsx(
            "flex max-h-50 flex-wrap gap-2 pt-1",
            "overflow-y-auto [&::-webkit-scrollbar]:w-0",
            showResults && "hidden"
          )}
        >
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className={clsx(
                "flex w-full items-center justify-between gap-1 px-2 py-1",
                "border-b border-gray-300"
              )}
            >
              <UserBasicInfo user={user} />
              <button
                onClick={() => removeUser(user.id)}
                className="cursor-pointer"
              >
                <XCircleIcon className="size-4 fill-gray-400 hover:fill-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Message textarea */}
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message to include with the invitation..."
        className={clsx(
          "myText md:w-14rem w-full px-4 py-1.5",
          "rounded-sm border border-gray-300",
          "text-sm text-black",
          "focus:border focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
          "hover:border-sky-400",
          showResults && "hidden"
        )}
        rows={4}
      />

      {/* Submit button */}
      {selectedUsers.length > 0 && (
        <button
          onClick={handleSubmit}
          className={clsx(
            "mt-2 w-full p-2 text-center font-semibold text-white",
            "rounded-sm bg-sky-500 hover:bg-sky-600",
            showResults && "hidden"
          )}
        >
          Send invitations
        </button>
      )}
    </div>
  );
}
