import { clsx } from "clsx";
import { useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import UserProfilePhoto from "../components/profile/UserProfilePhoto";
import { getPageNavigationMeta } from "../utils/pageNavigationMeta";
import { BellIcon } from "@phosphor-icons/react";

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
  const pagesMeta = getPageNavigationMeta();
  const location = useLocation();
  const currentPageMeta = pagesMeta[location.pathname] || "Page";

  return (
    <header
      className={clsx("mb-3 border-b border-gray-300 px-4 py-2", className)}
    >
      <div className={clsx("flex justify-between")}>
        <div className={clsx("flex flex-col justify-center gap-1")}>
          <h1 className={clsx("text-left text-lg font-medium text-black")}>
            {currentPageMeta.title}
          </h1>
          <div className={clsx("flex items-center justify-start")}>
            {currentPageMeta.icone && (
              <span className={clsx("mr-0.5", currentPageMeta.iconeColor)}>
                <currentPageMeta.icone
                  size={12}
                  weight="fill"
                  className="stroke-black stroke-3"
                />
              </span>
            )}

            <span className={clsx("text-xs text-gray-600")}>
              {currentPageMeta.message}
            </span>
          </div>
        </div>

        <div className={"flex items-center gap-3"}>
          <button
            className={clsx(
              "cursor-poin rounded-md border border-gray-300 p-2.5 text-black hover:bg-gray-100"
            )}
            title="Notifications"
          >
            <BellIcon size={20} weight="regular" />
          </button>
          <a
            className={
              "flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-100"
            }
            href={"/profile"}
          >
            {user ? (
              <>
                <UserProfilePhoto
                  imageUrl={user.imageUrl || null}
                  email={user.email}
                  username={user.userName}
                  size="size-8"
                />
                <div className={clsx("flex flex-col items-start")}>
                  {user.firstName && user.lastName ? (
                    <>
                      <span className={clsx("text-xs font-medium text-black")}>
                        {user.firstName} {user.lastName}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={clsx("text-xs font-medium text-black")}>
                        {user.userName}
                      </span>
                    </>
                  )}
                  <span className={clsx("text-xs text-gray-500")}>
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className={clsx("text-xs font-medium text-gray-500")}>
                  Déconnecté
                </span>
              </>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
