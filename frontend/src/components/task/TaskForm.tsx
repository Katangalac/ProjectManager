import { clsx } from "clsx";
import { TaskStatus, Task } from "../../types/Task";

import React from "react";
import { TASK_STATUS_META } from "../../lib/constants/task";
import { priorityLevelHelper } from "../../utils/priorityLevelHelper";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";

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

import DatePicker from "../ui/DatePicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  const NULL_VALUE = "__null__";
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

  const status = form.watch("status");

  useEffect(() => {
    if (status !== "COMPLETED") {
      form.setValue("completedAt", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [status, form]);

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
    // <-- Pour gérer null
    ...projects.map((p: Project) => ({
      label: p.title,
      value: p.id,
    })),
  ];

  const teamOptions = [
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
          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Title
            </label>
            <input
              type="text"
              className={clsx(
                "w-full px-4 py-2",
                "rounded-sm border border-gray-300 bg-inherit",
                "text-sm text-black",
                "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
                "hover:border-sky-400",
                form.formState.errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              )}
              placeholder="Ex: Tâche1"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Project
            </label>
            <Controller
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <Select
                  value={field.value ?? NULL_VALUE}
                  onValueChange={(val) =>
                    field.onChange(val === NULL_VALUE ? null : val)
                  }
                >
                  <SelectTrigger
                    className={clsx(
                      "w-full px-4 py-2",
                      "rounded-sm border",
                      "hover:border-sky-400",
                      "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
                      "text-black",
                      "shadow-none",
                      form.formState.errors.projectId
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  >
                    <SelectValue
                      className="text-black"
                      placeholder="Sélectionner une option"
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                    <SelectItem key="isolated-task-pr" value={NULL_VALUE}>
                      Isolated task
                    </SelectItem>
                    {projectOptions.map((option) => (
                      <SelectItem
                        key={option.value ?? "null-option"}
                        value={option.value ?? ""}
                        className="cursor-pointer px-4 py-2 text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:bg-sky-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.projectId && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.projectId.message}
              </p>
            )}
          </div>
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
                  value={field.value ?? NULL_VALUE}
                  onValueChange={(val) =>
                    field.onChange(val === NULL_VALUE ? null : val)
                  }
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
                      placeholder="Sélectionner une option"
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                    <SelectItem key="isolated-task-pr" value={NULL_VALUE}>
                      Isolated task
                    </SelectItem>
                    {teamOptions.map((option) => (
                      <SelectItem
                        key={option.value ?? "null-option"}
                        value={option.value ?? ""}
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
          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Status
            </label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={disableStatusInput}
                >
                  <SelectTrigger
                    className={clsx(
                      "w-full px-4 py-2",
                      "rounded-sm border",
                      "hover:border-sky-400",
                      "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
                      "text-black",
                      "shadow-none",
                      form.formState.errors.status
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  >
                    <SelectValue
                      className="text-black"
                      placeholder="Sélectionner une option"
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                    {statusOptions.map((option) => (
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
            {form.formState.errors.status && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Priority
            </label>
            <Controller
              control={form.control}
              name="priorityLevel"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  disabled={disableStatusInput}
                >
                  <SelectTrigger
                    className={clsx(
                      "w-full px-4 py-2",
                      "rounded-sm border",
                      "hover:border-sky-400",
                      "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
                      "text-black",
                      "shadow-none",
                      form.formState.errors.priorityLevel
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  >
                    <SelectValue
                      className="text-black"
                      placeholder="Sélectionner une option"
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                    {priorityOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                        className="cursor-pointer px-4 py-2 text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:bg-sky-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.priorityLevel && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.priorityLevel.message}
              </p>
            )}
          </div>

          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Progress
            </label>
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
                    "text-sm text-black",
                    "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
                    "hover:border-sky-400",
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
            {form.formState.errors.progress && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.progress.message}
              </p>
            )}
          </div>

          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Cost
            </label>
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
                    "text-sm text-black",
                    "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
                    "hover:border-sky-400",
                    form.formState.errors.cost
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="Ex: 10000"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {form.formState.errors.cost && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.cost.message}
              </p>
            )}
          </div>

          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Started on
            </label>
            <Controller
              control={form.control}
              name="startedAt"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(e) => field.onChange(e)}
                  buttonClassName={clsx(
                    form.formState.errors.startedAt
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              )}
            />
            {form.formState.errors.startedAt && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.startedAt.message}
              </p>
            )}
          </div>
          <div className={clsx("flex w-full flex-col gap-1")}>
            <label
              className={clsx(
                "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
              )}
            >
              Deadline
            </label>

            <Controller
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <DatePicker
                  value={
                    field.value ? new Date(field.value as Date) : undefined
                  }
                  onChange={(e) => field.onChange(e)}
                  buttonClassName={clsx(
                    form.formState.errors.deadline
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
              )}
            />
            {form.formState.errors.deadline && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.deadline.message}
              </p>
            )}
          </div>
          {isUpdateForm && (
            <div className={clsx("flex w-full flex-col gap-1")}>
              <label
                className={clsx(
                  "text-left text-sm font-medium text-gray-500 dark:text-gray-200"
                )}
              >
                Completed at
              </label>
              <Controller
                control={form.control}
                name="completedAt"
                render={({ field }) => (
                  <DatePicker
                    value={
                      field.value instanceof Date
                        ? field.value
                        : field.value
                          ? new Date(field.value as Date)
                          : undefined
                    }
                    onChange={(e) => field.onChange(e ?? null)}
                    buttonClassName={clsx(
                      form.formState.errors.completedAt
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                    buttonPlaceholder="Not completed yet"
                    disabled={status !== "COMPLETED"}
                  />
                )}
              />
              {form.formState.errors.completedAt && (
                <p className={clsx("text-left text-sm text-red-500")}>
                  {form.formState.errors.completedAt.message}
                </p>
              )}
            </div>
          )}
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
              <p className={clsx("text-left text-sm text-red-500")}>
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
      )}
    </div>
  );
}
