"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/lib/actions/signout";

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button type="submit" className="sign-out-button flex items-center gap-2">
        <Image
          src="/assets/icons/logout.svg"
          alt="logout"
          width={24}
          height={24}
          className="w-6"
        />
        <span className="hidden lg:inline">Logout</span>
      </Button>
    </form>
  );
} 