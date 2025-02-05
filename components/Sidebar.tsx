"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-cloudnest.svg"
          alt="CloudNest Logo"
          width={240}
          height={50}
          className="w-[180px] h-auto"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <a 
        href="https://github.com/heryckmp" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-3 mt-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
      >
        <Image
          src="/assets/icons/github.svg"
          alt="GitHub"
          width={24}
          height={24}
          className="text-gray-700 dark:text-gray-300 group-hover:text-brand dark:group-hover:text-brand transition-colors"
        />
        <div className="hidden lg:flex flex-col items-start">
          <span className="text-xs text-gray-500 dark:text-gray-400">Created by</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand dark:group-hover:text-brand">
            Erick Moreira
          </span>
        </div>
      </a>
    </aside>
  );
};

export default Sidebar;
