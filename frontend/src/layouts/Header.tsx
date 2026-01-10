import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useUserStore } from "../stores/userStore";
import UserProfilePhoto from "../components/profile/UserProfilePhoto";
import { Search, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationsShortList from "@/components/notification/NotificationsShortList";
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
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogStyle, setDialogStyle] = useState<string | null>(null);
  const [dialogHeaderStyle, setDialogHeaderStyle] = useState<string | null>(
    null
  );
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={clsx(
                  "cursor-pointer rounded-full border border-gray-300 px-2 py-2 hover:bg-gray-100"
                )}
                onClick={() => {
                  setDialogContent(<div>Search...</div>);
                  setDialogStyle(null);
                  setDialogHeaderStyle("bg-white text-black");
                  setDialogTitle("");
                  setShowDialog(true);
                }}
              >
                {/* <i className={clsx("pi pi-search size-4")} /> */}
                <Search className={clsx("size-5 stroke-2 text-gray-500")} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className={clsx(
                  "cursor-pointer rounded-full border border-gray-300 px-2 py-2 hover:bg-gray-100"
                )}
              >
                {/* <i className={clsx("pi pi-bell size-5")} /> */}
                <Bell className={clsx("size-5 stroke-2 text-gray-500")} />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className={clsx("flex flex-col gap-2")}>
                <span
                  className={clsx("text-left text-sm font-medium text-black")}
                >
                  Notifications
                </span>
                <NotificationsShortList />
              </div>
            </PopoverContent>
          </Popover>

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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-gray-400",
            "[&>button]:hover:text-black",
            dialogStyle
          )}
        >
          <DialogHeader
            className={clsx(
              "rounded-t-md bg-sky-500 px-4 py-4",
              dialogHeaderStyle
            )}
          >
            <DialogTitle className="text-lg text-black">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <div
            className={clsx(
              "max-h-[80vh] overflow-y-auto rounded-b-md pb-4 pl-4",
              "[&::-webkit-scrollbar]:w-0",
              "[&::-webkit-scrollbar-track]:rounded-md",
              "[&::-webkit-scrollbar-thumb]:rounded-md"
            )}
          >
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
