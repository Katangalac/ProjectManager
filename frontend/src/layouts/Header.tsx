import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import UserProfilePhoto from "../components/profile/UserProfilePhoto";

import { InputText } from "@/components/ui/InputText";
import { Search, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import { usePageMetaContext } from "@/hooks/utils/usePageMetaContext";

/**
 * Propriétés du Header
 *
 * - className: classe de style css
 */
type HeaderProps = {
  className?: string;
};

export default function Header({ className = "" }: HeaderProps) {
  const { user } = useUserStore();
  const { meta } = usePageMetaContext();

  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        "border-b border-gray-300 bg-white px-4 py-2 text-black",
        className
      )}
    >
      <div className={clsx("flex justify-between")}>
        <div className={clsx("flex flex-col justify-center gap-1")}>
          <div className={clsx("flex items-center justify-start gap-2")}>
            {meta.icon && <span>{meta.icon}</span>}
            <h1 className={clsx("text-left text-lg font-bold text-sky-500")}>
              {meta.title}
            </h1>
          </div>
          <span className={clsx("text-xs")}>{meta.message}</span>
        </div>

        <div className={"flex items-center gap-2"}>
          {/* <div>
            <InputText
              icon={<i className={clsx("pi pi-search")} />}
              iconPosition="left"
              placeholder="search..."
            />
          </div> */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={clsx(
                  "cursor-pointer rounded-full border border-gray-300 px-2 py-2 hover:bg-gray-100"
                )}
              >
                {/* <i className={clsx("pi pi-search size-4")} /> */}
                <Search className={clsx("size-5 stroke-2 text-gray-500")} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={clsx(
                  "cursor-pointer rounded-full border border-gray-300 px-2 py-2 hover:bg-gray-100"
                )}
              >
                {/* <i className={clsx("pi pi-bell size-5")} /> */}
                <Bell className={clsx("size-5 stroke-2 text-gray-500")} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <div
            className={
              "flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 hover:bg-gray-100"
            }
            onClick={() => navigate("/profile")}
          >
            {user ? (
              <>
                <UserProfilePhoto
                  userId={user.id}
                  imageUrl={user.imageUrl || null}
                  email={user.email}
                  username={user.userName}
                  size="size-12"
                  isOnline={user !== null}
                  showOnlineStatus={true}
                  imagefallback={
                    user.firstName && user.lastName
                      ? `${user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}`
                      : undefined
                  }
                  imageClassName="text-sm cursor-pointer"
                />
                {/* <div className={clsx("flex flex-col items-start")}>
                  {user.firstName && user.lastName ? (
                    <>
                      <span className={clsx("text-xs font-medium")}>
                        {user.firstName} {user.lastName}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={clsx("text-xs font-medium")}>
                        {user.userName}
                      </span>
                    </>
                  )}
                  <span className={clsx("text-xs text-gray-700")}>
                    {user.email}
                  </span>
                </div> */}
              </>
            ) : (
              <>
                <span className={clsx("text-xs font-medium text-gray-700")}>
                  Déconnecté
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
