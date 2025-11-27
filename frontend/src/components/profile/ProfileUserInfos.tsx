import { clsx } from "clsx";
import { UpdateUserData, User } from "../../types/User";
import { updateUserDataSchema } from "../../schemas/user.schemas";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { useState, useEffect, useCallback } from "react";
import { updateUser } from "../../services/user.services";
import { useUserStore } from "../../stores/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Propriétés du ProfileUserInfos
 * - user : l'utilisateur dont on affiche le profile
 * - isEditable : détermine si oui ou nom l'utilisateur peut modifier le profil,
 *                le profil est modifiable que son propriétaire

 */
type ProfileUserInfoProps = {
  user: User;
  isEditable: boolean;
};

/**
 * Affiche les informations personnelles de l'utilisateur dans le profil
 * Permet la modification des informations si l'utilisateur est le propriétaire du profil
 *
 * @param {ProfileUserInfoProps} param0 - Propriétés du ProfileUserInfos
 */
export default function ProfileUserInfo({
  user,
  isEditable,
}: ProfileUserInfoProps) {
  const { setUser } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (saving) console.log("Saving user info...");

  /**
   * Configuration de react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: {
      userName: user.userName,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      profession: user.profession ?? "",
    },
  });

  /**
   * Réinitialise le formulaire aux valeurs de l'utilisateur actuel
   */
  const resetToUser = useCallback(() => {
    reset({
      userName: user.userName,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      profession: user.profession ?? "",
    });
  }, [reset, user]);

  /**
   * Effet de bord pour réinitialiser le formulaire lorsque l'utilisateur change
   */
  useEffect(() => {
    resetToUser();
  }, [user, reset, resetToUser]);

  /**
   * Bascule le mode édition
   * Si on quitte le mode édition sans sauvegarder, réinitialise le formulaire aux valeurs de l'utilisateur actuel
   */
  const toogleEditingMode = () => {
    if (editing) {
      resetToUser();
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  /**
   * Fonction appelée lors de la soumission du formulaire de modification des informations utilisateur
   * Met à jour les informations de l'utilisateur et l'état global de l'utilisateur
   * En cas d'erreur, affiche un message dans la console
   * @param {UpdateUserData} data - données du formulaire de modification
   */
  const onSubmit = async (data: UpdateUserData) => {
    setSaving(true);
    try {
      const saved = await updateUser(data);
      if (saved?.data) {
        setUser(saved.data);
        reset(saved.data);
      } else {
        setUser({ ...user, ...data });
        reset({ ...user, ...data });
      }
      setSaving(false);
      setEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des informations :", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-5 px-7 py-4",
        "rounded-sm border border-gray-300",
        "dark:border-gray-500"
      )}
    >
      <div className={clsx("flex w-full flex-col items-start gap-2")}>
        <div className={clsx("flex w-full items-center justify-between")}>
          <h3
            className={clsx(
              "text-sm font-medium text-black",
              "dark:text-white"
            )}
          >
            Informations personnelles
          </h3>

          {/** Bouton de bascule du mode édition **/}
          {isEditable && (
            <button
              className={clsx(
                "flex items-center justify-between gap-3 px-2 py-1",
                "rounded-sm border border-gray-300 bg-gray-200 hover:bg-gray-100",
                "text-sm font-medium text-black",
                "dark:border-gray-400 dark:bg-cyan-800 dark:hover:bg-cyan-700",
                "dark:text-white"
              )}
              onClick={toogleEditingMode}
            >
              <span>{editing ? "Annuler" : "Modifier"}</span>
              <PencilSquareIcon className={clsx("size-3.5")} />
            </button>
          )}
        </div>

        <div
          className={clsx(
            "w-full border-b border-gray-300",
            "dark:border-gray-500"
          )}
        ></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={clsx("w-full")}>
        <div
          className={clsx("grid grid-cols-1 gap-x-28 gap-y-6 md:grid-cols-3")}
        >
          {/**Prénom de l'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Prénom
              </span>
              {errors.firstName && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.firstName ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("firstName")}
            />
          </div>

          {/**Nom de l'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Nom
              </span>
              {errors.lastName && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.lastName ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("lastName")}
            />
          </div>

          {/**Nom d'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Username
              </span>
              {errors.userName && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.userName.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.userName ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("userName")}
            />
          </div>

          {/**Email de l'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Email
              </span>
              {errors.email && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.email ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("email")}
            />
          </div>

          {/**Téléphone de l'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Téléphone
              </span>
              {errors.phoneNumber && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.phoneNumber ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("phoneNumber")}
            />
          </div>

          {/**Profession de l'utilisateur*/}
          <div className={clsx("flex flex-col")}>
            <div className={clsx("flex justify-between")}>
              <span
                className={clsx(
                  "flex justify-start",
                  "text-sm text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                Profession
              </span>
              {errors.profession && (
                <p className={clsx("text-sm text-red-500")}>
                  {errors.profession.message}
                </p>
              )}
            </div>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white",
                editing ? "rounded-sm border border-gray-300 p-2" : "",
                errors.profession ? "border-red-500" : ""
              )}
              type="text"
              placeholder="<non defini>"
              disabled={!editing}
              {...register("profession")}
            />
          </div>

          {/**Date de dernière connexion */}
          <div className={clsx("flex flex-col")}>
            <span
              className={clsx(
                "flex justify-start",
                "text-sm text-gray-500",
                "dark:text-gray-300"
              )}
            >
              Dernière connexion
            </span>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white"
              )}
              type="text"
              placeholder="<non defini>"
              disabled={true}
              value={
                user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString()
                  : ""
              }
            />
          </div>

          {/**Date d'inscription */}
          <div className={clsx("flex flex-col")}>
            <span
              className={clsx(
                "flex justify-start",
                "text-sm text-gray-500",
                "dark:text-gray-300"
              )}
            >
              Inscrit depuis
            </span>

            <input
              className={clsx(
                "flex justify-start",
                "text-sm font-medium text-black",
                "dark:text-white"
              )}
              type="text"
              placeholder="<non defini>"
              disabled={true}
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : ""
              }
            />
          </div>
        </div>

        {/**Bouton de soumission du formulaire de modification */}
        {editing && (
          <div className={clsx("flex w-full justify-end")}>
            <button
              type="submit"
              className={clsx(
                "px-2 py-1 font-semibold text-black",
                "rounded-sm bg-gray-300 hover:bg-gray-500"
              )}
            >
              Sauvegarder
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
