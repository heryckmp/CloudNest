"use client";

import Image from "next/image";
import { useUser } from "@/hooks/useUser";

export function UserButton() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="header-user">
      <Image
        src={user.imageUrl || "/assets/images/avatar.png"}
        alt="profile"
        width={40}
        height={40}
        className="header-user-avatar"
      />
      <div className="hidden lg:block">
        <p className="body-2 text-dark-100">{user.name}</p>
        <p className="caption text-light-100">{user.email}</p>
      </div>
    </div>
  );
} 