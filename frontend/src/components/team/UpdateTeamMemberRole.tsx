import { clsx } from "clsx";
import { useForm, Controller } from "react-hook-form";
import { useUpdateMember } from "@/hooks/mutations/team/useUpdateMember";
import { UpdateMemberRoleSchema } from "@/schemas/team.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "../../types/Team";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NoItems from "../commons/NoItems";
import { User } from "@/types/User";
import { showSuccess, showError } from "@/utils/toastService";

/**
 * * Propriétés du pdateTeamMemberRoleForm
 *
 *  - userId : l'utilisateur dont on veut changer le rôle
 *  - onSuccess : fonction appelée en cas de succès
 */
type UpdateTeamMemberRoleFormProps = {
  user: User;
  memberRole: string;
  team: Team;
  onSuccess: () => void;
};

/**
 * Formulaire d'ajout d'une équipe dans un projet
 * @param {UpdateTeamMemberRoleFormProps} param0 - Propriétés du formulaire
 */
export default function UpdateTeamMemberRoleForm({
  user,
  team,
  memberRole,
  onSuccess,
}: UpdateTeamMemberRoleFormProps) {
  const form = useForm({
    resolver: zodResolver(UpdateMemberRoleSchema),
    defaultValues: {
      memberId: user.id,
      teamId: team.id,
      memberRole: memberRole,
    },
  });

  const { updateTeamMemberRole } = useUpdateMember({
    onSuccess: () => showSuccess("Memeber role successfully updated!", 5000),
    onError: () => showError("An error occur while processing your request!"),
  });

  const roles = ["Leader", "Manager", "Member"];
  const roleOptions = roles.map((role) => ({
    label: role,
    value: role,
  }));

  const onSubmit = async (data: unknown) => {
    try {
      await updateTeamMemberRole(UpdateMemberRoleSchema.parse(data));
      console.log(form.formState.errors);
      await onSuccess();
    } catch (error: unknown) {
      console.log("An error occur while adding team to project", error);
    }
  };

  const onError = (errors: unknown) => {
    console.error(errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={clsx(
          "flex flex-col gap-3.5",
          !(roles.length > 0) && "items-center"
        )}
      >
        <p
          className={clsx(
            "text-center text-sm font-medium text-gray-500",
            "dark:text-gray-400"
          )}
        >
          Update <strong>{user.userName}</strong> role int the team "
          <strong>{team.name}</strong>"
        </p>

        {roleOptions.length > 0 ? (
          <>
            {" "}
            <div className={clsx("flex w-full flex-col gap-1")}>
              <label
                className={clsx(
                  "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
                )}
              >
                Role
              </label>
              <Controller
                control={form.control}
                name="memberRole"
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
                        placeholder="--Select a role--"
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                      {roleOptions.map((option) => (
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
            message="No roles available!"
            iconSize="size-15 stroke-1"
            textStyle="text-lg text-gray-400 font-medium"
            className="h-80 w-80 rounded-full bg-sky-50"
          />
        )}
      </form>
    </div>
  );
}
