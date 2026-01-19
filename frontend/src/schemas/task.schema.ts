import { z } from "zod";

/**
 * Schéma pour valider la structure de base d'une tâche dans la BD
 */
export const taskSchema = z.object({
  id: z.uuid("Invalid ID"),
  creatorId: z.uuid("Invalid ID").nullable(),
  projectId: z.uuid("Invalid ID").nullable(),
  teamId: z.uuid("Invalid ID").nullable(),
  title: z.string(),
  description: z.string(),
  priorityLevel: z.number().int().min(0).max(5),
  status: z
    .enum(["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"])
    .default("TODO"),
  cost: z.float64().default(0.0),
  progress: z.number().int().min(0).max(100).default(0),
  startedAt: z.date().transform((val) => {
    try {
      const date = new Date(val);
      return date;
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid date value for 'startedAt'",
          path: ["startedAt"],
        },
      ]);
    }
  }),
  deadline: z.date().transform((val) => {
    try {
      const date = new Date(val);
      return date;
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid date value for 'deadline'",
          path: ["deadline"],
        },
      ]);
    }
  }),
  completedAt: z
    .date()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === null) return null;
      try {
        const date = new Date(val);
        return date;
      } catch {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Invalid date value for 'completedAt'",
            path: ["completedAt"],
          },
        ]);
      }
    })
    .nullable(),
  updatedAt: z.date().transform((val) => {
    if (val === undefined) return undefined;

    try {
      const date = new Date(val);
      return date;
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid date value for 'updatedAt'",
          path: ["updatedAt"],
        },
      ]);
    }
  }),
  createdAt: z.date().transform((val) => {
    if (val === undefined) return undefined;
    try {
      const date = new Date(val);
      return date;
    } catch {
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid date value for 'createdAt'",
          path: ["createdAt"],
        },
      ]);
    }
  }),
});

/**
 * Schéma pour valider les données attendues lors de la création d'une nouvelle tâche
 */
export const createTaskSchema = taskSchema.omit({
  id: true,
  completedAt: true,
  updatedAt: true,
  createdAt: true,
});

/**
 * Schéma pour valider les données attendues lors de la modification d'une tâche
 */
export const updateTaskDataSchema = z.object({
  creatorId: z.uuid("Invalid ID").nullable().optional(),
  projectId: z.uuid("Invalid ID").nullable().optional(),
  teamId: z.uuid("Invalid ID").nullable().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  priorityLevel: z.coerce.number().int().min(0).max(5).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"]).optional(),
  cost: z.float64().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startedAt: z
    .date()
    .transform((val) => {
      if (val === undefined) return undefined;
      try {
        const date = new Date(val);
        return date;
      } catch {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Invalid date value for 'startedAt'",
            path: ["startedAt"],
          },
        ]);
      }
    })
    .optional(),
  deadline: z
    .date()
    .transform((val) => {
      if (val === undefined) return undefined;
      try {
        const date = new Date(val);
        return date;
      } catch {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Invalid date value for 'deadline'",
            path: ["deadline"],
          },
        ]);
      }
    })
    .optional(),
  completedAt: z
    .date()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val === null) return null;
      try {
        const date = new Date(val);
        return date;
      } catch {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Invalid date value for 'completedAt'",
            path: ["completedAt"],
          },
        ]);
      }
    })
    .nullable()
    .optional(),
});

/**
 * Schéma pour valider les données attendues comme filtre de recherche des taches
 */
export const searchTasksFilterSchema = z.object({
  title: z.string().optional(),
  priorityLevelEq: z.coerce.number().int().min(0).max(5).optional(),
  priorityLevelLt: z.coerce.number().int().min(0).max(5).optional(),
  priorityLevelGt: z.coerce.number().int().min(0).max(5).optional(),
  priorityLevelIn: z.array(z.number()).min(1, "Pas de tableau vide").optional(),
  progressEq: z.coerce.number().int().min(0).max(100).optional(),
  progressLt: z.coerce.number().int().min(0).max(100).optional(),
  progessGt: z.coerce.number().int().min(0).max(100).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"]).optional(),
  statusIn: z
    .array(z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "BLOCKED"]))
    .optional(),
  startOn: z.coerce.date().optional(),
  endOn: z.coerce.date().optional(),
  startBefore: z.coerce.date().optional(),
  endBefore: z.coerce.date().optional(),
  startAfter: z.coerce.date().optional(),
  endAfter: z.coerce.date().optional(),
  completedOn: z.coerce.date().optional(),
  completedBefore: z.coerce.date().optional(),
  completedAfter: z.coerce.date().optional(),
  page: z.coerce.number().int().optional(),
  pageSize: z.coerce.number().int().max(100).optional(),
  all: z
    .string()
    .transform((val) => {
      if (val === undefined) return undefined;
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
      throw new z.ZodError([
        {
          code: "custom",
          message: "Invalid boolean value for 'read'",
          path: ["read"],
        },
      ]);
    })
    .optional(),
});

export const userTaskSchema = z.object({
  userId: z.uuid("Invalid ID"),
  taskId: z.uuid("Invalid ID"),
});
