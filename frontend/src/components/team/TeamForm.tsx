import { clsx } from "clsx";
import React from "react";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "../../types/Team";
import { useCreateTeam } from "../../hooks/mutations/team/useCreateTeam";
import { useUpdateTeam } from "../../hooks/mutations/team/useUpdateTeam";

import { createTeamSchema } from "../../schemas/team.schemas";
import { updateTeamSchema } from "../../schemas/team.schemas";
import { Textarea } from "../ui/textarea";

type TeamFormProps = {
  defaultValues?: Partial<Team>;
  isUpdateForm: boolean;
  onSuccess: () => void;
};

export default function TeamForm({
  isUpdateForm,
  defaultValues,
  onSuccess,
}: TeamFormProps) {
  const schema = isUpdateForm ? updateTeamSchema : createTeamSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const { createTeam } = useCreateTeam({ onSuccess });
  const { updateTeam } = useUpdateTeam({ onSuccess });

  const onSubmit = (data: unknown) => {
    if (!isUpdateForm) {
      createTeam(createTeamSchema.parse(data));
    } else {
      if (defaultValues?.id) {
        updateTeam({
          teamId: defaultValues.id,
          data: updateTeamSchema.parse(data),
        });
      } else {
        console.error("id de l'équipe pas transmis");
      }
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
                  "focus:border-2 focus:border-sky-500 focus:outline-2 focus:outline-sky-600",
                  "hover:border-sky-400",
                  form.formState.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                )}
                placeholder="Tap here..."
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
            "rounded-sm bg-sky-600 hover:bg-sky-700"
          )}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
