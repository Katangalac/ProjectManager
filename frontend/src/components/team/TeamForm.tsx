import { clsx } from "clsx";

import { InputTextarea } from "primereact/inputtextarea";

import React from "react";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "../../types/Team";
import { useCreateTeam } from "../../hooks/mutations/team/useCreateTeam";
import { useUpdateTeam } from "../../hooks/mutations/team/useUpdateTeam";

import { createTeamSchema } from "../../schemas/team.schemas";
import { updateTeamSchema } from "../../schemas/team.schemas";

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
    console.log(form.formState.errors);
    if (!isUpdateForm) {
      console.log("Creation");
      console.log("Data:", createTeamSchema.parse(data));
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
        <div className={clsx("flex w-full flex-col gap-2")}>
          <div className={clsx("flex justify-between")}>
            <label
              className={clsx("font-medium text-gray-500 dark:text-gray-200")}
            >
              Name
            </label>
            {form.formState.errors.name && (
              <p className={clsx("text-sm text-red-500")}>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <input
            type="text"
            className={clsx(
              "w-full px-4 py-2",
              "rounded-sm border border-gray-300 bg-inherit",
              "text-gray-700",
              form.formState.errors.name ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Ex: Team 1"
            {...form.register("name")}
          />
        </div>
        <div className={clsx("flex w-full flex-col gap-2")}>
          <div className={clsx("flex justify-between")}>
            <label
              className={clsx("font-medium text-gray-500 dark:text-gray-200")}
            >
              Description
            </label>
            {form.formState.errors.description && (
              <p className={clsx("text-sm text-red-500")}>
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <InputTextarea
                value={field.value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  field.onChange(e.target.value)
                }
                rows={5}
                cols={30}
                className={clsx(
                  "myText md:w-14rem w-full py-1.5 pl-4",
                  "rounded-sm border border-gray-300",
                  form.formState.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                )}
                placeholder="Tap here..."
              />
            )}
          />
        </div>
        <button
          type="submit"
          className={clsx(
            "w-full p-2 text-center font-semibold text-white",
            "rounded-sm bg-sky-600 hover:bg-sky-700"
          )}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
