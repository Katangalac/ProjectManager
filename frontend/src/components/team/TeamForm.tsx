import { clsx } from "clsx";
import React, { useCallback } from "react";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "../../types/Team";
import { useCreateTeam } from "../../hooks/mutations/team/useCreateTeam";
import { useUpdateTeam } from "../../hooks/mutations/team/useUpdateTeam";

import { createTeamSchema } from "../../schemas/team.schemas";
import { updateTeamSchema } from "../../schemas/team.schemas";
import { Textarea } from "../ui/textarea";
import { showError, showSuccess } from "@/utils/toastService";

/**
 * Propriétés du formulaire de création/modification d'une équipe
 *
 *  - defaultValues : valeurs préchargées du formaulaire
 *  - isUpdateForm : détermie si c'est un formulaire de modification ou création
 *  - onSuccess : fonction appelée en cas de succès
 *
 */
type TeamFormProps = {
  defaultValues?: Partial<Team>;
  isUpdateForm: boolean;
  onSuccess: () => void;
};

/**
 * Formulaire de création/modification d'une équipe
 *
 * @param {TeamFormProps} param0 - Propriétés du formulaire
 */
export default function TeamForm({
  isUpdateForm,
  defaultValues,
  onSuccess,
}: TeamFormProps) {
  const schema = isUpdateForm ? updateTeamSchema : createTeamSchema;
  const message = isUpdateForm
    ? "Team updated successfully!"
    : "Team create successfully!";

  const handleSuccess = useCallback(() => {
    showSuccess(message);
    onSuccess();
  }, []);

  const handleError = useCallback(() => {
    showError("An error occur while processing your request!");
  }, []);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const { createTeam } = useCreateTeam({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  const { updateTeam } = useUpdateTeam({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const onSubmit = async (data: unknown) => {
    try {
      if (!isUpdateForm) {
        await createTeam(createTeamSchema.parse(data));
      } else {
        if (defaultValues?.id) {
          await updateTeam({
            teamId: defaultValues.id,
            data: updateTeamSchema.parse(data),
          });
        } else {
          console.error("id de l'équipe pas transmis");
          showError("An error occur while processing your request!");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className={clsx("flex flex-col gap-3.5")}
      >
        <div className={clsx("flex w-full flex-col gap-1")}>
          <label
            className={clsx(
              "text-left font-medium text-gray-500 dark:text-gray-200"
            )}
          >
            Name
          </label>
          <input
            type="text"
            className={clsx(
              "w-full px-4 py-2",
              "rounded-sm border border-gray-300 bg-inherit",
              "text-sm text-black",
              "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
              "hover:border-sky-400",
              form.formState.errors.name ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Ex: Team 1"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className={clsx("text-left text-sm text-red-500")}>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className={clsx("flex w-full flex-col gap-1")}>
          <label
            className={clsx(
              "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
            )}
          >
            Description
          </label>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <Textarea
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                rows={5}
                cols={30}
                className={clsx(
                  "myText md:w-14rem w-full px-4 py-1.5",
                  "rounded-sm border border-gray-300",
                  "text-sm text-black",
                  "focus:border focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
                  "hover:border-sky-400",
                  form.formState.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                )}
                placeholder="Write here..."
              />
            )}
          />
          {form.formState.errors.description && (
            <p className={clsx("text-sm text-red-500")}>
              {form.formState.errors.description.message}
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
      </form>
    </div>
  );
}
