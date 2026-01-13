import { Menu } from "primereact/menu";
import { useRef } from "react";
import { clsx } from "clsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  PencilSimpleLineIcon,
  UserCircleMinusIcon,
  UserCirclePlusIcon,
  TrashIcon,
  FileMagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { Project } from "@/types/Project";
import { MenuItem } from "primereact/menuitem";
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import AddTeamToProjectForm from "./AddTeamToProjectForm";
import RemoveTeamFromProjectForm from "./RemoveTeamFromProject";
import { useDeleteProject } from "@/hooks/mutations/project/useDeleteProject";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { showError, showSuccess } from "@/utils/toastService";

/**
 * Propriétés du menu d'un projet
 *
 * - projet: le projet concernée par le menu
 */
type ProjectActionMenuProps = {
  project: Project;
};

/**
 * Menu d'actions réalisables pour un projet
 *
 * @param {ProjectActionMenuProps} param0 - propriétés du menu
 */
export default function ProjectActionMenu({ project }: ProjectActionMenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogStyle, setDialogStyle] = useState<string | null>(null);
  const [dialogHeaderStyle, setDialogHeaderStyle] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const { deleteProject } = useDeleteProject({
    onSuccess: () => {
      showSuccess("Project deleted successfully!");
    },
    onError: () => showError("An error occur while processing your request!"),
  });
  const menu = useRef<Menu>(null);
  const menuItems: MenuItem[] = [
    {
      label: "Options",
      className: "px-2 py-2 font-medium",
      items: [
        {
          label: "See details",
          className:
            "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          icon: (
            <FileMagnifyingGlassIcon
              weight="regular"
              size={16}
              className={clsx("stroke-1.5 mr-1")}
            />
          ),
          command: () => {
            navigate(`/userProjects/${project.id}`);
          },
        },
        {
          label: "Edit this project",
          icon: (
            <PencilSimpleLineIcon
              size={16}
              weight="regular"
              className={clsx("stroke-1.5 mr-1")}
            />
          ),
          className:
            "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            setDialogHeaderStyle(null);
            setDialogStyle(null);
            setDialogTitle(`Edit project "${project.title}"`);
            setDialogContent(
              <ProjectForm
                isUpdateForm={true}
                defaultValues={{
                  ...project,
                  startedAt: new Date(project.startedAt),
                  deadline: new Date(project.deadline),
                  completedAt: project.completedAt
                    ? new Date(project.completedAt)
                    : null,
                }}
                onSuccess={() => setShowDialog(false)}
              />
            );
            setShowDialog(true);
          },
        },
        {
          label: "Add team",
          icon: (
            <UserCirclePlusIcon
              weight="regular"
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          className:
            "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            setDialogHeaderStyle(null);
            setDialogStyle(null);
            setDialogTitle("Add team to this project");
            setDialogContent(
              <AddTeamToProjectForm
                project={project}
                onSuccess={() => setShowDialog(false)}
              />
            );
            setShowDialog(true);
          },
        },
        {
          label: "Remove team",
          icon: (
            <UserCircleMinusIcon
              weight="regular"
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          className:
            "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            setDialogHeaderStyle(null);
            setDialogStyle(null);
            setDialogTitle("Remove team from this project");
            setDialogContent(
              <RemoveTeamFromProjectForm
                project={project}
                onSuccess={() => setShowDialog(false)}
              />
            );
            setShowDialog(true);
          },
        },
        {
          label: "Delete",
          icon: (
            <TrashIcon
              size={16}
              weight="regular"
              className={clsx("stroke-1.5 mr-1")}
            />
          ),
          className:
            "px-2 py-1.5 rounded-b-md hover:bg-red-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            setDialogHeaderStyle("bg-transparent px-0 py-0");
            setDialogStyle("w-fit px-5");
            setDialogTitle("");
            setDialogContent(
              <div
                className={clsx(
                  "flex w-full flex-col items-center justify-start"
                )}
              >
                <span className={clsx("mb-4 rounded-md bg-red-200 p-2")}>
                  <TrashIcon
                    size={30}
                    weight="regular"
                    className={clsx("text-red-700")}
                  />
                </span>
                <span className={clsx("text-lg font-medium text-black")}>
                  Delete project?
                </span>
                <span className={clsx("text-sm font-medium text-gray-500")}>
                  Are you sure you want to delete this project?
                </span>
                <div
                  className={clsx(
                    "flex w-full items-center justify-center gap-5 p-5"
                  )}
                >
                  <DialogClose>
                    <button
                      className={clsx(
                        "rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      No,cancel
                    </button>
                  </DialogClose>
                  <button
                    className={
                      "rounded-md border border-red-700 bg-red-700 px-5 py-2 text-sm font-medium text-white hover:bg-red-800"
                    }
                    onClick={() => deleteProject(project.id)}
                  >
                    Yes, i'm sure
                  </button>
                </div>
              </div>
            );

            setShowDialog(true);
          },
        },
      ],
    },
  ];

  return (
    <div className={clsx("justify-content-center flex w-fit")}>
      <Menu
        model={menuItems}
        popup
        ref={menu}
        id={`${project.id}`}
        popupAlignment="left"
        className={clsx(
          "min-w-35 rounded-md border border-gray-300 bg-white shadow-lg",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-xs text-gray-700",
          "dark:text-gray-300"
        )}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={(event) => {
              menu.current?.toggle(event);
            }}
          >
            <EllipsisHorizontalIcon
              className={clsx(
                "size-4 cursor-pointer text-gray-700 hover:stroke-2",
                "dark:text-white"
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>Options</TooltipContent>
      </Tooltip>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white",
            dialogStyle
          )}
        >
          <DialogHeader
            className={clsx(
              "rounded-t-md bg-sky-500 px-4 py-4",
              dialogHeaderStyle
            )}
          >
            <DialogTitle className="text-lg text-white">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md py-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
