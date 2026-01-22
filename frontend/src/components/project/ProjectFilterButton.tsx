import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchProjectsFilter, ProjectStatus } from "@/types/Project";
import { PROJECT_STATUS_META } from "@/lib/constants/project";
import DatePicker from "../ui/DatePicker";
import { clsx } from "clsx";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunnelIcon, FunnelXIcon } from "@phosphor-icons/react";
import { isObjectNotEmpty } from "@/utils/stringUtils";

type Props = {
  projectsFilter: SearchProjectsFilter;
  setProjectsFilter: (filter: SearchProjectsFilter) => void;
};

const STATUSES = Object.entries(PROJECT_STATUS_META).map(([status, meta]) => ({
  value: status as ProjectStatus,
  label: meta.label,
}));

/**
 * Bouton de filtrage des projets
 */
export default function ProjectFilterButton({
  projectsFilter,
  setProjectsFilter,
}: Props) {
  const [localFilter, setLocalFilter] = useState<SearchProjectsFilter>({
    ...projectsFilter,
  });
  //   const toggleArrayValue = <T,>(key: keyof SearchTasksFilter, value: T) => {
  //     const current = (localFilter[key] as T[]) ?? [];
  //     setLocalFilter({
  //       ...localFilter,
  //       [key]: current.includes(value)
  //         ? current.filter((v) => v !== value)
  //         : [...current, value],
  //     });
  //   };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={clsx(
            "mt-2 flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-transparent px-2 py-2 text-xs font-medium",
            "hover:bg-gray-100 focus:ring-2 focus:ring-sky-300 focus:outline-none",
            isObjectNotEmpty(projectsFilter) && "bg-sky-200"
          )}
        >
          {isObjectNotEmpty(projectsFilter) ? (
            <FunnelIcon weight="fill" className="text-sky-500" size={16} />
          ) : (
            <FunnelXIcon
              size={16}
              className="stroke-2 text-gray-400"
              weight="fill"
            />
          )}
          Filters
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        style={{
          width: 300,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        sideOffset={8}
        avoidCollisions={true}
        collisionPadding={16}
        className="max-h-[500px] overflow-y-auto"
      >
        {/* STATUS */}
        <div>
          <span className="text-sm font-bold">Status</span>
          <div className="mt-1 flex flex-col gap-1">
            <Select
              value={localFilter.status}
              onValueChange={(value: ProjectStatus) =>
                setLocalFilter({ ...localFilter, status: value ?? undefined })
              }
            >
              <SelectTrigger
                className={clsx(
                  "w-full px-4 py-2",
                  "rounded-sm border",
                  "hover:border-sky-400",
                  "focus:border-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
                  "text-black",
                  "shadow-none"
                )}
              >
                <SelectValue
                  className="text-black"
                  placeholder="Pick a status"
                />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                {STATUSES.map((option) => (
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
            {/* {STATUSES.map((status) => (
              <label
                key={status.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={
                    localFilter.statusIn?.includes(status.value) ?? false
                  }
                  onChange={() => toggleArrayValue("statusIn", status.value)}
                />
                <span className="text-sm">{status.label}</span>
              </label>
            ))} */}
          </div>
        </div>

        {/* START BEFORE */}
        <div>
          <span className="text-sm font-bold">Start before</span>
          <DatePicker
            value={
              localFilter.startBefore
                ? new Date(localFilter.startBefore)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({ ...localFilter, startBefore: e ?? undefined })
            }
          />
        </div>

        {/* START ON */}
        <div>
          <span className="text-sm font-bold">Start on</span>
          <DatePicker
            value={
              localFilter.startOn ? new Date(localFilter.startOn) : undefined
            }
            onChange={(e) =>
              setLocalFilter({ ...localFilter, startOn: e ?? undefined })
            }
          />
        </div>

        {/* START AFTER */}
        <div>
          <span className="text-sm font-bold">Start after</span>
          <DatePicker
            value={
              localFilter.startAfter
                ? new Date(localFilter.startAfter)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({ ...localFilter, startAfter: e ?? undefined })
            }
          />
        </div>

        {/* DEADLINE BEFORE */}
        <div>
          <span className="text-sm font-bold">Deadline before</span>
          <DatePicker
            value={
              localFilter.endBefore
                ? new Date(localFilter.endBefore)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({ ...localFilter, endBefore: e ?? undefined })
            }
          />
        </div>

        {/* DEADLINE ON */}
        <div>
          <span className="text-sm font-bold">Deadline on</span>
          <DatePicker
            value={localFilter.endOn ? new Date(localFilter.endOn) : undefined}
            onChange={(e) =>
              setLocalFilter({ ...localFilter, endOn: e ?? undefined })
            }
          />
        </div>

        {/* DEADLINE AFTER */}
        <div>
          <span className="text-sm font-bold">Deadline after</span>
          <DatePicker
            value={
              localFilter.endAfter ? new Date(localFilter.endAfter) : undefined
            }
            onChange={(e) =>
              setLocalFilter({ ...localFilter, endAfter: e ?? undefined })
            }
          />
        </div>

        {/* COMPLETED BEFORE DATE */}
        <div>
          <span className="text-sm font-bold">Completed before</span>
          <DatePicker
            value={
              localFilter.completedBefore
                ? new Date(localFilter.completedBefore)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({
                ...localFilter,
                completedBefore: e ?? undefined,
              })
            }
          />
        </div>

        {/* COMPLETED ON DATE */}
        <div>
          <span className="text-sm font-bold">Completed on</span>
          <DatePicker
            value={
              localFilter.completedOn
                ? new Date(localFilter.completedOn)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({
                ...localFilter,
                completedOn: e ?? undefined,
              })
            }
          />
        </div>

        {/* COMPLETED AFTER */}
        <div>
          <span className="text-sm font-bold">Completed after</span>
          <DatePicker
            value={
              localFilter.completedAfter
                ? new Date(localFilter.completedAfter)
                : undefined
            }
            onChange={(e) =>
              setLocalFilter({
                ...localFilter,
                completedAfter: e ?? undefined,
              })
            }
          />
        </div>

        {/* CONFIRM */}
        <button
          className={clsx(
            "mt-2 cursor-pointer rounded-md border border-gray-300 bg-transparent px-2 py-1.5 text-sm font-medium",
            "hover:bg-gray-100 hover:text-sky-600"
          )}
          onClick={() => {
            setProjectsFilter(localFilter);
          }}
        >
          Confirm
        </button>

        {/* RESET */}
        <button
          className={clsx(
            "mt-2 cursor-pointer rounded-md border border-gray-300 bg-transparent px-2 py-1.5 text-sm font-medium",
            "hover:bg-gray-100 hover:text-red-600"
          )}
          onClick={() => {
            setLocalFilter({});
            setProjectsFilter({});
          }}
        >
          Clear filters
        </button>
      </PopoverContent>
    </Popover>
  );
}
