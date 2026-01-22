import { clsx } from "clsx";
import { useForm, Controller } from "react-hook-form";
import { userTaskSchema } from "@/schemas/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskWithRelations } from "@/types/Task";
import { useUnassignTaskTask } from "@/hooks/mutations/task/useUnassignTask";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoItems from "../commons/NoItems";
import UserBasicInfo from "../profile/UserBasicInfo";
import { showError, showSuccess } from "@/utils/toastService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * * Propriétés du AssignTaskForm
 *
 *  - project : le projet dans lequel on veut ajouter une équipe
 *  - onSuccess : fonction appelée en cas de succès
 */
type UnAssignTaskFormProps = {
  task: TaskWithRelations;
  onSuccess: () => void;
};

/**
 * Formulaire de desassignation d'une tâche d'un utilisateur
 * @param {UnAssignTaskFormProps} param0 - Propriétés du formulaire
 */
export default function UnAssignTaskForm({
  task,
  onSuccess,
}: UnAssignTaskFormProps) {
  const queryClient = useQueryClient();
  const { unassignTask } = useUnassignTaskTask({
    onSuccess: () => {
      showSuccess("Task unassigned successfully!");
      if (task.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["projectTasks", task.projectId],
        });
      }
      if (task.teamId) {
        queryClient.invalidateQueries({
          queryKey: ["teamTasks", task.teamId],
        });
      }
      onSuccess();
    },
    onError: () => showError("An error occur while processing your request!"),
  });
  const peerOptions =
    task.assignedTo?.map((assignTo) => ({
      label: <UserBasicInfo user={assignTo.user} />,
      value: assignTo.user.id,
    })) || [];

  const form = useForm({
    resolver: zodResolver(userTaskSchema),
    defaultValues: { taskId: task.id },
  });

  const onSubmit = async (data: unknown) => {
    try {
      console.log(form.formState.errors);
      await unassignTask(userTaskSchema.parse(data));
    } catch (error: unknown) {
      console.log("An error occur while unassigning task from user", error);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      {
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
            />
          )}
        </form>
      }
    </div>
  );
}
