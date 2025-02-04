import React from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-[#3B82F6] dark:bg-[#FFB5C5] p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full-cloudnest-white.svg"
            alt="logo"
            width={240}
            height={50}
            className="h-auto w-[240px]"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            priority
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white dark:bg-[#1E293B] p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="flex w-full items-center justify-between mb-16">
          <Image
            src="/assets/icons/logo-full-cloudnest.svg"
            alt="logo"
            width={240}
            height={50}
            className="h-auto w-[240px] dark:hidden"
          />
          <Image
            src="/assets/icons/logo-full-cloudnest-white.svg"
            alt="logo"
            width={240}
            height={50}
            className="h-auto w-[240px] hidden dark:block"
          />
          <ThemeToggle />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
