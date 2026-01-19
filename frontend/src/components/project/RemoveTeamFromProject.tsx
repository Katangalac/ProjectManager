import { clsx } from "clsx";
import { useForm, Controller } from "react-hook-form";
import { ProjectTeamSchema } from "@/schemas/project.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "../../types/Project";
import { Team } from "../../types/Team";
import { useRemoveTeam } from "@/hooks/mutations/project/useRemoveTeam";
import { useProjectTeams } from "@/hooks/queries/project/useProjectTeams";
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
import { showError, showSuccess } from "@/utils/toastService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * * Propriétés du RemoveTeamFromProjectForm
 *
 *  - project : le projet duquel on veut retirer une équipe
 *  - onSuccess : fonction appelée en cas de succès
 */
type RemoveTeamFromProjectFormProps = {
  project: Project;
  onSuccess: () => void;
};

/**
 * Formulaire de retrait d'une équipe d'un projet
 * @param {RemoveTeamFromProjectFormmProps} param0 - Propriétés du formulaire
 */
export default function RemoveTeamFromProjectForm({
  project,
  onSuccess,
}: RemoveTeamFromProjectFormProps) {
  const queryClient = useQueryClient();
  const {
    data: projectTeams,
    isLoading: projectTeamsLoading,
    isError: projectTeamsError,
  } = useProjectTeams(project.id, { all: true });

  const form = useForm({
    resolver: zodResolver(ProjectTeamSchema),
    defaultValues: { projectId: project.id },
  });

  const { removeTeamFromProject } = useRemoveTeam({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTeams", project.id] });
      showSuccess("Team removed from project successfully!", 5000);
      onSuccess();
    },
    onError: () => showError("An error occur while processing your request!"),
  });

  const teamOptions =
    projectTeams?.data.map((t: Team) => ({
      label: t.name,
      value: t.id,
    })) ?? [];

  const onSubmit = async (data: unknown) => {
    try {
      console.log(form.formState.errors);
      await removeTeamFromProject(ProjectTeamSchema.parse(data));
    } catch (error: unknown) {
      console.log("An error occur while adding team to project", error);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div
      className={clsx(
        "mr-5 ml-1",
        projectTeamsLoading && "flex flex-col items-center justify-center gap-4"
      )}
    >
      {projectTeamsLoading && (
        <ProgressSpinner className="sm:h-10 lg:h-15" strokeWidth="4" />
      )}
      {!projectTeamsLoading && (
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={clsx(
            "flex flex-col gap-3.5",
            !(projectTeams && projectTeams.data.length > 0) && "items-center"
          )}
        >
          <p
            className={clsx(
              "text-center text-sm font-medium text-gray-500",
              "dark:text-gray-400"
            )}
          >
            Remove a team from the project "<strong>{project.title}</strong>"
          </p>
          {projectTeamsError && <UserErrorMessage />}
          {projectTeams && projectTeams.data.length > 0 ? (
            <>
              {" "}
              <div className={clsx("flex w-full flex-col gap-1")}>
                <label
                  className={clsx(
                    "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
                  )}
                >
                  Team
                </label>
                <Controller
                  control={form.control}
                  name="teamId"
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
                          form.formState.errors.teamId
                            ? "border-red-500"
                            : "border-gray-300"
                        )}
                      >
                        <SelectValue
                          className="text-black"
                          placeholder="--Select a team--"
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                        {teamOptions.map((option) => (
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
                {form.formState.errors.teamId && (
                  <p className={clsx("text-left text-sm text-red-500")}>
                    {form.formState.errors.teamId.message}
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
              message="No teams available!"
              iconSize="size-15 stroke-1"
              textStyle="text-lg text-gray-400 font-medium"
            />
          )}
        </form>
      )}
    </div>
  );
}
