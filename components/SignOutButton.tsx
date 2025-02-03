"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/lib/actions/signout";

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button type="submit" className="sign-out-button">
        <Image
          src="/assets/icons/logout.svg"
          alt="logout"
          width={24}
          height={24}
          className="w-6"
        />
      </Button>
    </form>
  );
} 