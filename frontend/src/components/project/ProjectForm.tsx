import { clsx } from "clsx";
import { PROJECT_STATUS_META } from "@/lib/constants/project";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import {
  createProjectSchema,
  updateProjectDataSchema,
} from "@/schemas/project.schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project, ProjectStatus } from "../../types/Project";
import { useCreateProject } from "@/hooks/mutations/project/useCreateProject";
import { useUpdateProject } from "@/hooks/mutations/project/useUpdateProject";
import DatePicker from "../ui/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showError, showSuccess } from "@/utils/toastService";

/**
 * Propriétés du ProjectForm
 *
 *  - defaultValues : valeurs par défaut du formulaire
 *  - isUpdateForm : détermine s'il s'agit d'une mise à jour ou d'une création
 *  - status : status du projet à créer
 *  - disableStatusInput : détermine si oui ou non rendre le champ du status non modifiable
 *  - onSuccess : fonction appelée en cas de succès
 */
type ProjectFormProps = {
  defaultValues?: Partial<Project>;
  isUpdateForm: boolean;
  status?: ProjectStatus;
  disableStatusInput?: boolean;
  onSuccess: () => void;
};

/**
 * Formulaire de création et de mise à jour d'un projet
 * @param {ProjectFormProps} param0 - propriétés du formualire
 */
export default function ProjectForm({
  isUpdateForm,
  defaultValues,
  disableStatusInput,
  onSuccess,
}: ProjectFormProps) {
  const schema = isUpdateForm
    ? updateProjectDataSchema
    : createProjectSchema.extend({
        completedAt: z.coerce.date().optional(),
        actualCost: z.float64().optional(),
      });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const status = form.watch("status");
  const progress = form.watch("progress");
  const completedAt = form.watch("completedAt");

  useEffect(() => {
    if (status === "COMPLETED") {
      if (progress !== 100) {
        form.setValue("progress", 100, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (!completedAt) {
        form.setValue("completedAt", new Date(), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [status]);

  useEffect(() => {
    if (progress === 100) {
      if (status !== "COMPLETED") {
        form.setValue("status", "COMPLETED", {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (!completedAt) {
        form.setValue("completedAt", new Date(), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [progress]);

  useEffect(() => {
    if (status !== "COMPLETED") {
      form.setValue("completedAt", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [status]);

  const { createProject } = useCreateProject({
    onSuccess: () => {
      showSuccess("Project created successfully!");
      onSuccess();
    },
    onError: () => showError("An error occur while processing your request!"),
  });
  const { updateProject } = useUpdateProject({
    onSuccess: () => {
      showSuccess("Project edited successfully!");
      onSuccess();
    },
    onError: () => showError("An error occur while processing your request!"),
  });

  const statusOptions = Object.entries(PROJECT_STATUS_META).map(
    ([status, meta]) => ({
      value: status as ProjectStatus,
      label: meta.label,
    })
  );

  const onSubmit = async (data: unknown) => {
    if (!isUpdateForm) {
      await createProject(createProjectSchema.parse(data));
    } else {
      if (defaultValues?.id) {
        await updateProject({
          projectId: defaultValues.id,
          data: updateProjectDataSchema.parse(data),
        });
      } else {
        console.error("id du projet pas transmis");
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
              form.formState.errors.title ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Ex: Project-1"
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
            Planned Cost
          </label>
          <Controller
            control={form.control}
            name="budgetPlanned"
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
                  form.formState.errors.budgetPlanned
                    ? "border-red-500"
                    : "border-gray-300"
                )}
                placeholder="Ex: 10000"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          {form.formState.errors.budgetPlanned && (
            <p className={clsx("text-left text-sm text-red-500")}>
              {form.formState.errors.budgetPlanned.message}
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
              Actual Cost
            </label>
            <Controller
              control={form.control}
              name="actualCost"
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
                    form.formState.errors.actualCost
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="Ex: 10000"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {form.formState.errors.actualCost && (
              <p className={clsx("text-left text-sm text-red-500")}>
                {form.formState.errors.actualCost.message}
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
            Started on
          </label>
          <Controller
            control={form.control}
            name="startedAt"
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value as Date) : undefined}
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
                value={field.value ? new Date(field.value as Date) : undefined}
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
                  "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 focus:outline-none",
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
            "rounded-sm bg-sky-500 hover:bg-sky-600"
          )}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
