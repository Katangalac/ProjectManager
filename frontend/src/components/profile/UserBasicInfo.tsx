import UserProfilePhoto from "./UserProfilePhoto";
import { clsx } from "clsx";
import { User } from "@/types/User";
import { cn } from "@/lib/utils";

type UserBasicInfoProps = {
  user: User;
  avatarImageSize?: string;
};

export default function UserBasicInfo({
  user,
  avatarImageSize = "h-8 w-8",
}: UserBasicInfoProps) {
  const userIdentifier =
    user.lastName && user.firstName
      ? `${user.firstName} ${user.lastName}`
      : `${user.userName}`;
  const userProfession = user.profession || "Unknown";
  return (
    <div className={cn("flex h-fit w-fit items-center gap-2")}>
      <div className={clsx("h-fit w-fit")}>
        <UserProfilePhoto
          username={user.userName}
          email={user.email}
          imageUrl={user.imageUrl}
          size={avatarImageSize}
        />
      </div>
      <div className={clsx("flex h-fit w-fit flex-col")}>
        <span className={clsx("text-left text-xs font-medium text-black")}>
          {userIdentifier}
        </span>
        <span className={clsx("text-left text-xs text-gray-600")}>
          {userProfession}
        </span>
      </div>
    </div>
  );
}
