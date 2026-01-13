import { useCreateConversation } from "@/hooks/mutations/conversation/useCreateConversation";
import { clsx } from "clsx";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useState } from "react";

/**
 * Propriétés du formulaire de création/modification d'une équipe
 *
 *  - defaultValues : valeurs préchargées du formaulaire
 *  - isUpdateForm : détermie si c'est un formulaire de modification ou création
 *  - onSuccess : fonction appelée en cas de succès
 *
 */
type TeamFormProps = {
  teamId: string | null;
  onSuccess: () => void;
};

/**
 * Formulaire de création/modification d'une équipe
 *
 * @param {TeamFormProps} param0 - Propriétés du formulaire
 */
export default function ConversationForm({ onSuccess, teamId }: TeamFormProps) {
  const conversationData = {
    isGroup: teamId !== null,
    teamId: teamId,
    participantIds: [],
  };

  let messageError: string | null = null;
  const [message, setMessage] = useState<string>("");

  const { createConversation, error } = useCreateConversation();

  const handleSendMessageClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() === "") {
      messageError = "The message can not  be empty";
      return;
    }
    await createConversation({ ...conversationData, message });
    onSuccess();
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      <form
        onSubmit={handleSendMessageClick}
        className={clsx("flex flex-col gap-3.5")}
      >
        {error && (
          <p className="text-xs text-red-500">
            An error occur while processing your request. Retry please
          </p>
        )}
        {messageError && <p className="text-xs text-red-500">{messageError}</p>}
        <div
          className={clsx(
            "flex h-full w-full flex-col items-center justify-start gap-2",
            "rounded-sm border border-gray-300 shadow-lg"
          )}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className={clsx(
              "myText min-h-0 w-full flex-3 resize-none p-2",
              "rounded-sm border-none shadow-none",
              "text-sm text-black",
              "focus:ring-none focus-ring-0 focus:border-none focus:outline-none",
              "[&::-webkit-scrollbar]:w-0"
            )}
            placeholder="Write your message here..."
          />
          <div
            className={clsx(
              "flex min-h-0 w-full flex-1 items-center justify-end p-2"
            )}
          >
            <button
              type="submit"
              className={clsx(
                "flex items-center justify-center gap-1 px-2 py-1",
                "rounded-sm bg-sky-500 hover:bg-sky-600",
                "text-sm font-medium text-white"
              )}
              //   onClick={handleSendMessageClick}
            >
              <PaperPlaneTiltIcon weight="fill" />
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
