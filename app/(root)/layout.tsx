import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

interface User {
  $id: string;
  accountId: string;
  name: string;
  email: string;
  imageUrl?: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser() as User;

  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation 
          $id={currentUser.$id}
          accountId={currentUser.accountId}
          fullName={currentUser.name}
          avatar={currentUser.imageUrl || "/assets/images/avatar.png"}
          email={currentUser.email}
        />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content overflow-y-auto">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default Layout;
