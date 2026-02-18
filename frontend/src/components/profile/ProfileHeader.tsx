/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from "clsx";
import { User } from "../../types/User";
import { FileUploaderRegular, UploadCtxProvider } from "@uploadcare/react-uploader";
import { useState, ReactNode } from "react";
import { userStore } from "../../stores/userStore";
import { updateUser } from "../../api/user.api";
import "@uploadcare/react-uploader/core.css";
import { CameraIcon } from "@heroicons/react/24/solid";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpdatePasswordForm from "../auth/UpdatePasswordForm";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { DownloadSimpleIcon, TrashIcon, NotePencilIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { deleteUploadcareFile } from "@/utils/uploadcare";
import UserProfilePhoto from "./UserProfilePhoto";
import { RotateCcwKeyIcon } from "lucide-react";

/**
 * Propriétés du ProfileHeader
 * - user : l'utilisateur dont on affiche le profile
 * - isEditable : détermine si oui ou nom l'utilisateur peut modifier le profil,
 *                le profil est modifiable que son propriétaire

 */
type ProfileHeaderProps = {
  user: User;
  isEditable: boolean;
};

/**
 * En-têce du profil de l'utilisateur
 * Affiche l'image de profil, le nom, le prénom, la profession et l'email
 * Permet la modification de l'image de profil si l'utilisateur est le propriétaire du profil
 *
 * @param {ProfileHeaderProps} param0 - Propriétés du ProfileHeader
 */
export default function ProfileHeader({ user, isEditable }: ProfileHeaderProps) {
  const { setUser } = userStore();
  const uploadcarePubKey = import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY;
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogStyle, setDialogStyle] = useState<string | null>(null);
  const [dialogHeaderStyle, setDialogHeaderStyle] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(user.imageUrl ?? null);
  const [saving, setSaving] = useState(false);
  if (saving) console.log("Saving image...");

  /**
   * Fonction appelée lors du changement de l'image de profil
   * Met à jour l'image de profil de l'utilisateur et l'état global de l'utilisateur
   * En cas d'erreur, rétablit l'ancienne image de profil
   *
   * @param {string} url - URL de la nouvelle image de profil
   */
  const handleImageChange = async (url: string | null) => {
    if (url === undefined) return;
    try {
      if (imageUrl) {
        await deleteUploadcareFile(imageUrl);
      }
      setImageUrl(url);
      setSaving(true);
      const saved = await updateUser({ imageUrl: url });
      setUser(saved.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image de profil :", error);
      setImageUrl(user.imageUrl ?? null);
    } finally {
      setSaving(false);
    }
  };
  const uploaderRef = useRef<UploadCtxProvider>(null);
  const menu = useRef<Menu>(null);
  const menuItems: MenuItem[] = [
    {
      label: "Edit",
      className: "px-2 py-2 font-medium",
      items: [
        {
          label: "Upload new image",
          className: "px-2 py-1.5 hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          icon: (
            <DownloadSimpleIcon weight="regular" size={16} className={clsx("stroke-1.5 mr-1")} />
          ),
          command: () => {
            uploaderRef.current?.api.setCurrentActivity("start-from");
            uploaderRef.current?.api.setModalState(true);
          },
        },

        {
          label: "Remove image",
          icon: <TrashIcon size={16} weight="regular" className={clsx("stroke-1.5 mr-1")} />,
          className: "px-2 py-1.5 rounded-b-md hover:bg-sky-100 dark:hover:bg-gray-700 myMenu",
          command: () => {
            handleImageChange(null);
          },
        },
      ],
    },
  ];

  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 px-6 py-2 shadow-md",
        "rounded-sm border border-gray-300",
        "dark:border-gray-500"
      )}
    >
      <div className={clsx("flex items-center gap-4")}>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          popupAlignment="left"
          className={clsx(
            "min-w-35 rounded-md border border-gray-300 bg-white shadow-lg",
            "dark:border-gray-600 dark:bg-gray-900",
            "text-xs text-gray-700",
            "dark:text-gray-300"
          )}
        />
        <div
          className={clsx(
            "relative flex h-fit max-h-fit w-fit max-w-fit items-center justify-center",
            "rounded-full",
            "text-gray-500",
            "dark:text-gray-400"
          )}
        >
          {/**Image de profil de l'utilisateur */}
          <UserProfilePhoto
            userId={user.id}
            username={user.userName}
            email={user.email}
            imageUrl={imageUrl}
            size="size-20"
            imagefallback={
              user.firstName && user.lastName
                ? `${user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}`
                : undefined
            }
            imageClassName="text-3xl"
          />

          {/**Uploader de fichier pour changer l'image de profil */}
          {isEditable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <button
                    className={clsx(
                      "flex h-fit w-fit justify-center p-1",
                      "rounded-full bg-white hover:bg-gray-200",
                      "text-black",
                      "absolute -right-1 bottom-2"
                    )}
                    onClick={(event) => {
                      menu.current?.toggle(event);
                    }}
                  >
                    <CameraIcon className={clsx("size-3.5")} />
                  </button>
                  <FileUploaderRegular
                    apiRef={uploaderRef}
                    sourceList="local, camera, facebook, gdrive"
                    cameraModes="photo"
                    pubkey={uploadcarePubKey}
                    multiple={false}
                    onFileUploadSuccess={(file) => {
                      const url = file?.cdnUrl;
                      handleImageChange(url);
                    }}
                    className="invisible absolute -right-1 bottom-2"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-sky-500">Upload a photo</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className={clsx("flex flex-col")}>
          {/**Nom et prénom de l'utilisateur ou UserName*/}
          <div className={clsx("flex gap-2")}>
            {user.firstName && (
              <span className={clsx("text-sm font-medium text-black", "dark:text-white")}>
                {user.firstName}
              </span>
            )}
            {user.lastName && (
              <span className={clsx("text-sm font-medium text-black", "dark:text-white")}>
                {user.lastName}
              </span>
            )}
            {!user.firstName && !user.lastName && (
              <span className={clsx("text-sm font-medium text-black", "dark:text-white")}>
                {user.userName}
              </span>
            )}
          </div>

          {/**Profession et email de l'utilisateur */}
          <div className={clsx("flex flex-col items-start")}>
            {user.profession && (
              <span className={clsx("text-sm text-gray-500", "dark:text-gray-400")}>
                {user.profession}
              </span>
            )}
            <span className={clsx("text-sm text-gray-500", "dark:text-gray-400")}>
              {user.email}
            </span>
          </div>
        </div>
      </div>
      {isEditable && !user.oauthId && (
        <div className={clsx("flex h-16 items-start")}>
          <button
            className={clsx(
              "flex items-center justify-between gap-3 px-2 py-1",
              "rounded-sm bg-sky-500 shadow-md hover:bg-sky-600",
              "border border-sky-500",
              "text-sm font-medium text-white",
              "dark:bg-sky-800 dark:hover:bg-sky-700",
              "dark:text-white"
            )}
            onClick={() => {
              setDialogHeaderStyle(null);
              setDialogStyle(null);
              setDialogTitle("Change password");
              setDialogContent(<UpdatePasswordForm onSuccess={() => setShowDialog(false)} />);
              setShowDialog(true);
            }}
          >
            <span>Change password</span>
            <NotePencilIcon weight="bold" className={clsx("size-4")} />
          </button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className={clsx(
            "max-w-[500px] p-0",
            "[&>button]:text-white",
            "[&>button]:hover:text-white",
            dialogStyle
          )}
        >
          <DialogHeader className={clsx("rounded-t-md bg-sky-500 px-4 py-4", dialogHeaderStyle)}>
            <DialogTitle className="text-lg text-white">
              <span className="flex h-fit items-center gap-2">
                <RotateCcwKeyIcon className="size-6 stroke-[2.5px]" />
                Update password
              </span>
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
    </div>
  );
}
