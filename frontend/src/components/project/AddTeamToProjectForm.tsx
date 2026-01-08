import { clsx } from "clsx";
import { useForm, Controller } from "react-hook-form";
import { ProjectTeamSchema } from "@/schemas/project.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "../../types/Project";
import { Team } from "../../types/Team";
import { useAddTeam } from "@/hooks/mutations/project/useAddTeam";
import { useTeams } from "../../hooks/queries/team/useTeams";
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

/**
 * * Propriétés du AddTeamToProjectForm
 *
 *  - project : le projet dans lequel on veut ajouter une équipe
 *  - onSuccess : fonction appelée en cas de succès
 */
type AddTeamToProjectFormProps = {
  project: Project;
  onSuccess: () => void;
};

/**
 * Formulaire d'ajout d'une équipe dans un projet
 * @param {AddTeamToProjectFormProps} param0 - Propriétés du formulaire
 */
export default function AddTeamToProjectForm({
  project,
  onSuccess,
}: AddTeamToProjectFormProps) {
  const {
    data: teams = [],
    isLoading: teamLoading,
    isError: teamError,
  } = useTeams({ all: true });

  const {
    data: projectTeams = [],
    isLoading: projectTeamsLoading,
    isError: projectTeamsError,
  } = useProjectTeams(project.id, { all: true });

  const { addTeamToProject } = useAddTeam();
  const projectTeamIds = projectTeams.map((team) => team.id);
  const filteredTeams = teams.filter(
    (team: Team) => !projectTeamIds.includes(team.id)
  );
  const teamOptions = [
    ...filteredTeams.map((t: Team) => ({
      label: t.name,
      value: t.id,
    })),
  ];

  const form = useForm({
    resolver: zodResolver(ProjectTeamSchema),
    defaultValues: { projectId: project.id },
  });

  const onSubmit = async (data: unknown) => {
    try {
      console.log(form.formState.errors);
      await addTeamToProject(ProjectTeamSchema.parse(data));
      onSuccess();
    } catch (error: unknown) {
      console.log("An error occur while adding team to project", error);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      {(projectTeamsLoading || teamLoading) && <ProgressSpinner />}
      {!(projectTeamsLoading && teamLoading) && (
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={clsx(
            "flex flex-col gap-3.5",
            !(teams.length > 0) && "items-center"
          )}
        >
          <p
            className={clsx(
              "text-center text-sm font-medium text-gray-500",
              "dark:text-gray-400"
            )}
          >
            Add a team to the project "<strong>{project.title}</strong>"
          </p>
          {(projectTeamsError || teamError) && <UserErrorMessage />}
          {teams.length > 0 ? (
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
              className="h-80 w-80 rounded-full bg-sky-50"
            />
          )}
        </form>
      )}
    </div>
  );
}
