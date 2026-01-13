import { HandWavingIcon } from "@phosphor-icons/react";
import { PageMeta } from "@/types/PageMeta";

/**
 * Meta-données des pages de l'application
 */
export const pageMetaRecord: Record<string, PageMeta> = {
  dashboard: {
    title: "Dashboard",
    message: (
      <span className="flex h-fit items-center gap-1">
        <span className="relative inline-flex items-center justify-center">
          <HandWavingIcon weight="fill" className="size-4 fill-amber-400" />
          <HandWavingIcon
            weight="regular"
            className="absolute size-4 text-black"
          />
        </span>
        Welcome back! Here's your latest snapshot
      </span>
    ),
  },
  userProjects: {
    title: "Projects",
    message: "Manage and organize your projects",
  },
  userTasks: {
    title: "Tasks",
    message: "Track your progress across all tasks",
  },
  userTeams: {
    title: "Teams",
    message: "Collaborate with your teams",
  },

  notifications: {
    title: "Notifications",
    message: "Your notifications",
  },

  profile: {
    title: "Profile",
    message: "Manage your personal settings",
  },
  calendar: {
    title: "Calendar",
    message: "Overview of your timeline",
  },
  messages: {
    title: "Messages",
    message: "Your conversations and messages",
  },
};
