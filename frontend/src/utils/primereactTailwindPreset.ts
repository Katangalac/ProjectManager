import { TabMenuThroughMethodOptions } from "primereact/tabmenu";
import { classNames } from "primereact/utils";

/**
 * Configuration tailwind pour primereact
 */
export const tailwindPreset = {
  tabmenu: {
    root: { className: "w-full" },
    menu: {
      className: "px-0 pl-0",
    },
    menuitem: { className: "mr-0" },
    action: (options: TabMenuThroughMethodOptions | undefined) => ({
      className: classNames(
        "px-2 py-2 mr-2 text-sm font-medium text-gray-700 bg-inherit",
        "border-b-2 rounded-t-none hover:text-sky-400",
        "outline-none focus:outline-none focus:ring-0 focus:shadow-none",
        {
          "outline-none focus:outline-none focus:shadow-none focus:ring-0 bg-white border-sky-600 text-sky-600 dark:bg-gray-900 dark:border-sky-300 dark:text-sky-300":
            options?.state.activeIndex === options?.context.index,
          "hover:bg-red-100 hover:border-red-400 hover:text-green-600 dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 dark:hover:bg-gray-800/80":
            options?.state.activeIndex !== options?.context.index,
        }
      ),
    }),
    icon: { className: "mr-2" },
  },
};
