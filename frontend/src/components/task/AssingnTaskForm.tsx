import { clsx } from "clsx";
import { useForm, Controller } from "react-hook-form";
import { userTaskSchema } from "@/schemas/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskWithRelations } from "@/types/Task";
import { useAssignTaskTask } from "@/hooks/mutations/task/useAssignTask";
import { useUserPeers } from "@/hooks/queries/user/useUserPeers";
// import { useProjectCollaborators } from "@/hooks/queries/project/useProjectCollaborators";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoItems from "../commons/NoItems";
import UserErrorMessage from "../commons/UserErrorMessage";
import UserBasicInfo from "../profile/UserBasicInfo";

/**
 * * Propriétés du AssignTaskForm
 *
 *  - project : le projet dans lequel on veut ajouter une équipe
 *  - onSuccess : fonction appelée en cas de succès
 */
type AssignTaskFormProps = {
  task: TaskWithRelations;
  onSuccess: () => void;
};

/**
 * Formulaire d'assignation d'une tâche à un utilisateur
 * @param {AssignTaskFormProps} param0 - Propriétés du formulaire
 */
export default function AssignTaskForm({
  task,
  onSuccess,
}: AssignTaskFormProps) {
  const {
    data: peers,
    isLoading: peersLoading,
    isError: peersError,
  } = useUserPeers();

  //   const {
  //     data: projectCollaborators = [],
  //     isLoading: projectCollaboratorsLoading,
  //     isError: projectCollaboratorsError,
  //   } = useProjectCollaborators(project.id, { all: true });
  const { assignTask } = useAssignTaskTask();

  //   const projectTeamIds = projectCollaborators.map((team) => team.id);
  //   const filteredTeams = peers.filter(
  //     (team: Team) => !projectTeamIds.includes(team.id)
  //   );
  const assignToIds =
    task.assignedTo?.map((assignTo) => assignTo.user.id) || [];
  const filteredPeers =
    peers?.data.filter((user) => !assignToIds.includes(user.id)) || [];

  const peerOptions =
    filteredPeers.map((user) => ({
      label: <UserBasicInfo user={user} />,
      value: user.id,
    })) || [];

  const form = useForm({
    resolver: zodResolver(userTaskSchema),
    defaultValues: { taskId: task.id },
  });

  const onSubmit = async (data: unknown) => {
    try {
      console.log(form.formState.errors);
      await assignTask(userTaskSchema.parse(data));
      onSuccess();
    } catch (error: unknown) {
      console.log("An error occur while assigning task to user", error);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      {peersLoading && <ProgressSpinner />}
      {!peersLoading && (
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={clsx(
            "flex flex-col gap-3.5",
            !(peerOptions.length > 0) && "items-center"
          )}
        >
          <p
            className={clsx(
              "text-center text-sm font-medium text-gray-500",
              "dark:text-gray-400"
            )}
          >
            Assign user to the task "<strong>{task.title}</strong>"
          </p>
          {peersError && <UserErrorMessage />}
          {peerOptions.length > 0 ? (
            <>
              {" "}
              <div className={clsx("flex w-full flex-col gap-1")}>
                <label
                  className={clsx(
                    "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
                  )}
                >
                  User
                </label>
                <Controller
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <SelectTrigger
                        className={clsx(
                          "w-full px-4 py-2",
                          "rounded-sm border",
                          "hover:border-sky-400",
                          "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
                          "text-black",
                          "shadow-none",
                          form.formState.errors.userId
                            ? "border-red-500"
                            : "border-gray-300"
                        )}
                      >
                        <SelectValue
                          className="text-black"
                          placeholder="--Select a user--"
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                        {peerOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer px-4 py-2 text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:bg-sky-100"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.userId && (
                  <p className={clsx("text-left text-sm text-red-500")}>
                    {form.formState.errors.userId.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={clsx(
                  "mt-2 w-full p-2 text-center font-semibold text-white",
                  "rounded-sm bg-sky-500 hover:bg-sky-600"
                )}
              >
                Confirm
              </button>
            </>
          ) : (
            <NoItems
              message="No users available!"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
              className="h-80 w-80 rounded-full bg-sky-50"
            />
          )}
        </form>
      )}
    </div>
  );
}
