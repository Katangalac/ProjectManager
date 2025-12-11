import { clsx } from "clsx";
import { TaskStatus, Task } from "../../types/Task";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import { useForm, Controller } from "react-hook-form";

import {
  createTaskSchema,
  updateTaskDataSchema,
} from "../../schemas/task.schema";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "../../types/Project";
import { Team } from "../../types/Team";
import { useCreateTask } from "../../hooks/mutations/task/useCreateTask";
import { useUpdateTask } from "../../hooks/mutations/task/useUpdateTask";
import { useTeams } from "../../hooks/queries/team/useTeams";
import { useProjects } from "../../hooks/queries/project/useProjects";
import { ProgressSpinner } from "primereact/progressspinner";

type TaskFormProps = {
  defaultValues?: Partial<Task>;
  isUpdateForm: boolean;
  status?: TaskStatus;
  disableStatusInput?: boolean;
  onSuccess: () => void;
};

export default function TaskForm({
  isUpdateForm,
  defaultValues,
  disableStatusInput,
  onSuccess,
}: TaskFormProps) {
  const {
    data: projects = [],
    isLoading: projectLoading,
    isError: projectError,
  } = useProjects({ all: true });

  const {
    data: teams = [],
    isLoading: teamLoading,
    isError: teamError,
  } = useTeams({ all: true });
  const schema = isUpdateForm
    ? updateTaskDataSchema
    : createTaskSchema.extend({ completedAt: z.coerce.date().optional() });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const { createTask } = useCreateTask({ onSuccess });
  const { updateTask } = useUpdateTask({ onSuccess });

  if (projectLoading || teamLoading) {
    <div>
      <ProgressSpinner />
    </div>;
  }
  if (projectError || teamError) {
    if (projectError) {
      return <div>An error occur while loading user projects</div>;
    }

    if (teamError) {
      return <div>An error occur while loading user teams</div>;
    }
  }
  const projectOptions = [
    { label: "Isolated task", value: "null" }, // <-- Pour gérer null
    ...projects.map((p: Project) => ({
      label: p.title,
      value: p.id,
    })),
  ];

  const teamOptions = [
    { label: "Isolated task", value: "null" }, // <-- Pour gérer null
    ...teams.map((t: Team) => ({
      label: t.name,
      value: t.id,
    })),
  ];

  const statusOptions = Object.entries(TASK_STATUS_META).map(
    ([status, meta]) => ({
      value: status as TaskStatus,
      label: meta.label,
    })
  );

  const priorityOptions = Object.entries(priorityLevelHelper).map(
    ([priorityLevel, priorityLevelMeta]) => ({
      value: Number(priorityLevel),
      label: priorityLevelMeta.label,
    })
  );

  const onSubmit = (data: unknown) => {
    console.log(form.formState.errors);
    if (!isUpdateForm) {
      console.log("Creation");
      console.log("Data:", createTaskSchema.parse(data));
      createTask(createTaskSchema.parse(data));
    } else {
      if (defaultValues?.id) {
        updateTask({
          taskId: defaultValues.id,
          data: updateTaskDataSchema.parse(data),
        });
      } else {
        console.error("id de la tache pas transmis");
      }
    }
  };

  const onError = (errors: unknown) => {
    console.log("SUBMIT ERRORS:", errors);
  };

  return (
    <div className={clsx("mr-5 ml-1")}>
      {!(projectLoading && teamLoading) && (
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={clsx("flex flex-col gap-3.5")}
        >
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Title
              </label>
              {form.formState.errors.title && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <input
              type="text"
              className={clsx(
                "w-full px-4 py-2",
                "rounded-sm border border-gray-300 bg-inherit",
                "text-gray-700",
                form.formState.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              )}
              placeholder="Ex: Tâche1"
              {...form.register("title")}
            />
          </div>
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Project
              </label>
              {form.formState.errors.projectId && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.projectId.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(e) => {
                    console.log(typeof e.value);
                    field.onChange(e.value === "null" ? null : e.value);
                  }}
                  options={projectOptions || []}
                  placeholder="Isolated task"
                  className={clsx(
                    "md:w-14rem myInput w-full py-2 pl-4",
                    "rounded-sm border border-gray-300 bg-inherit",
                    form.formState.errors.projectId
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              )}
            />
          </div>
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Team
              </label>
              {form.formState.errors.teamId && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.teamId.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value === "null" ? null : e.value);
                  }}
                  options={teamOptions || []}
                  placeholder="Isolated task"
                  className={clsx(
                    "md:w-14rem myInput w-full py-2 pl-4",
                    "rounded-sm border border-gray-300 bg-inherit",
                    form.formState.errors.teamId
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              )}
            />
          </div>
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Status
              </label>
              {form.formState.errors.status && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  options={statusOptions}
                  placeholder="--Sélectionner un status--"
                  className={clsx(
                    "md:w-14rem myInput w-full py-2 pl-4",
                    "rounded-sm border border-gray-300 bg-inherit",
                    form.formState.errors.status
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  disabled={disableStatusInput}
                />
              )}
            />
          </div>
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Priority
              </label>
              {form.formState.errors.priorityLevel && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.priorityLevel.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="priorityLevel"
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  options={priorityOptions}
                  placeholder="--Sélectionner une priorité--"
                  className={clsx(
                    "md:w-14rem myInput w-full py-2 pl-4",
                    "rounded-sm border border-gray-300 bg-inherit",
                    form.formState.errors.priorityLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              )}
            />
          </div>

          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Progress
              </label>
              {form.formState.errors.progress && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.progress.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="progress"
              render={({ field }) => (
                <input
                  type="number"
                  value={String(field.value)}
                  className={clsx(
                    "w-full px-4 py-2",
                    "rounded-sm border border-gray-300 bg-inherit",
                    "text-gray-700",
                    form.formState.errors.progress
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  min={0}
                  max={100}
                  placeholder="Ex: 0-100"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Cost
              </label>
              {form.formState.errors.cost && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.cost.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="cost"
              render={({ field }) => (
                <input
                  type="number"
                  value={field.value}
                  className={clsx(
                    "w-full px-4 py-2",
                    "rounded-sm border border-gray-300 bg-inherit",
                    "text-gray-700",
                    form.formState.errors.cost
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="Ex: 10000"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Started on
              </label>
              {form.formState.errors.startedAt && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.startedAt.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="startedAt"
              render={({ field }) => (
                <Calendar
                  value={new Date(field.value as Date)}
                  onChange={(e) => field.onChange(e.value)}
                  dateFormat="dd-mm-yy"
                  className={clsx(
                    "md:w-14rem w-full py-2 pl-4",
                    "rounded-sm border border-gray-300",
                    form.formState.errors.startedAt
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="dd-mm-yyyy"
                />
              )}
            />
          </div>
          <div className={clsx("flex w-full flex-col gap-2")}>
            <div className={clsx("flex justify-between")}>
              <label
                className={clsx("font-medium text-gray-500 dark:text-gray-200")}
              >
                Deadline
              </label>
              {form.formState.errors.deadline && (
                <p className={clsx("text-sm text-red-500")}>
                  {form.formState.errors.deadline.message}
                </p>
              )}
            </div>
            <Controller
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <Calendar
                  value={new Date(field.value as Date)}
                  onChange={(e) => field.onChange(e.value)}
                  dateFormat="dd-mm-yy"
                  className={clsx(
                    "md:w-14rem w-full py-2 pl-4",
                    "rounded-sm border border-gray-300",
                    form.formState.errors.deadline
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="dd-mm-yyyy"
                />
              )}
            />
          </div>
          {isUpdateForm && (
            <div className={clsx("flex w-full flex-col gap-2")}>
              <div className={clsx("flex justify-between")}>
                <label
                  className={clsx(
                    "font-medium text-gray-500 dark:text-gray-200"
                  )}
                >
                  Completed at
                </label>
                {form.formState.errors.completedAt && (
                  <p className={clsx("text-sm text-red-500")}>
                    {form.formState.errors.completedAt.message}
                  </p>
                )}
              </div>
              <Controller
                control={form.control}
                name="completedAt"
                render={({ field }) => (
                  <Calendar
                    value={field.value ? new Date(field.value as Date) : null}
                    onChange={(e) => field.onChange(e.value)}
                    dateFormat="dd-mm-yy"
                    className={clsx(
                      "md:w-14rem w-full py-2 pl-4",
                      "rounded-sm border border-gray-300",
                      form.formState.errors.completedAt
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                    placeholder="dd-mm-yyyy"
                  />
                )}
              />
            </div>
          )}
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
              "rounded-sm bg-sky-400 hover:bg-sky-500"
            )}
          >
            Confirm
          </button>
        </form>
      )}
    </div>
  );
}
