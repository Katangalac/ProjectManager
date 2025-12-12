import { Menu } from "primereact/menu";
import { useRef } from "react";
import { clsx } from "clsx";
import {
  DocumentMagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { UserCircleMinusIcon, UserCirclePlusIcon } from "@phosphor-icons/react";
import { TaskWithRelations } from "../../types/Task";
import { MenuItem } from "primereact/menuitem";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { useState, ReactNode } from "react";
import TaskDetails from "./TaskDetails";
import TaskForm from "./TaskForm";
import { useDeleteTask } from "../../hooks/mutations/task/useDeleteTask";

/**
 * Propriétés du menu d'une tâche
 *
 * - task: la tâche concernée par le menu
 */
type TaskActionMenuProps = {
  task: TaskWithRelations;
};

/**
 * Menu d'actions réalisables pour une tâche
 *
 * @param {TaskActionMenuProps} param0 - propriétés du menu
 */
export default function TaskActionMenu({ task }: TaskActionMenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const { deleteTask } = useDeleteTask();
  const menu = useRef<Menu>(null);
  const menuItems: MenuItem[] = [
    {
      label: "Options",
      className: "px-2 py-2 font-medium",
      items: [
        {
          label: "See details",
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          icon: (
            <DocumentMagnifyingGlassIcon
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          command: () => {
            setDialogTitle(`Task : ${task.title}`);
            setDialogContent(<TaskDetails task={task} />);
            setShowDialog(true);
          },
        },
        {
          label: "Edit",
          icon: <PencilIcon className={clsx("stroke-1.5 mr-1 size-4")} />,
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            setDialogTitle("Edit task");
            setDialogContent(
              <TaskForm
                isUpdateForm={true}
                defaultValues={task}
                onSuccess={() => setShowDialog(false)}
              />
            );
            setShowDialog(true);
          },
        },
        {
          label: "Assign",
          icon: (
            <UserCirclePlusIcon
              weight="regular"
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            // Action pour assigner la tâche
          },
        },
        {
          label: "Unassign",
          icon: (
            <UserCircleMinusIcon
              weight="regular"
              className={clsx("stroke-1.5 mr-1 size-4")}
            />
          ),
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            // Action pour desassigner la tâche
          },
        },
        {
          label: "Delete",
          icon: <TrashIcon className={clsx("stroke-1.5 mr-1 size-4")} />,
          className: "px-2 py-1 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            confirmDialog({
              message: "Do you really want to delete this task?",
              header: "Confirmation",
              icon: (
                <ExclamationTriangleIcon
                  className={clsx("mr-1 size-8 stroke-2 text-red-700")}
                />
              ),
              accept: () => deleteTask(task.id),
              acceptLabel: "Yes",
              rejectLabel: "No",
            });
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
        id={`${task.id}`}
        popupAlignment="left"
        className={clsx(
          "min-w-35 rounded-md border border-gray-300 bg-white shadow-lg",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-xs text-gray-700",
          "dark:text-gray-300"
        )}
      />
      <button title="Options" onClick={(event) => menu.current?.toggle(event)}>
        <EllipsisHorizontalIcon
          className={clsx(
            "size-4 cursor-pointer text-gray-700 hover:stroke-2",
            "dark:text-white"
          )}
        />
      </button>
      <Dialog
        header={dialogTitle}
        visible={showDialog}
        style={{ width: "40vw" }}
        modal
        onHide={() => setShowDialog(false)}
        className={clsx(
          "min-w-fit gap-5 rounded-lg border border-gray-300 bg-white p-5 text-sm",
          "dark:border-gray-600 dark:bg-gray-900",
          "text-gray-700 dark:text-gray-300",
          "myDialog"
        )}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
}
