import { clsx } from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import UserProfilePhoto from "../components/profile/UserProfilePhoto";
import { getPageNavigationMeta } from "../utils/pageNavigationMeta";

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
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        "mb-3 border-b border-gray-300 bg-sky-600 px-4 py-2 text-white",
        className
      )}
    >
      <div className={clsx("flex justify-between")}>
        <div className={clsx("flex flex-col justify-center gap-1")}>
          <h1 className={clsx("text-left text-lg font-medium text-white")}>
            {currentPageMeta.title}
          </h1>
          <div className={clsx("flex items-center justify-start")}>
            {currentPageMeta.icone && (
              <span className={clsx("mr-0.5", currentPageMeta.iconeColor)}>
                <currentPageMeta.icone
                  size={14}
                  weight="fill"
                  className="stroke-black stroke-3"
                />
              </span>
            )}

            <span className={clsx("text-xs text-white")}>
              {currentPageMeta.message}
            </span>
          </div>
        </div>

        <div className={"flex items-center gap-3"}>
          <button
            className={clsx(
              "cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-white hover:bg-sky-700"
            )}
            title="Notifications"
          >
            <i className={clsx("pi pi-bell size-4")} />
          </button>
          <div
            className={
              "flex cursor-pointer items-center gap-1 rounded-md border border-gray-200 px-2 py-1 hover:bg-sky-700"
            }
            onClick={() => navigate("/profile")}
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
                      <span className={clsx("text-xs font-medium text-white")}>
                        {user.firstName} {user.lastName}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={clsx("text-xs font-medium text-white")}>
                        {user.userName}
                      </span>
                    </>
                  )}
                  <span className={clsx("text-xs text-gray-300")}>
                    {user.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className={clsx("text-xs font-medium text-gray-300")}>
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
