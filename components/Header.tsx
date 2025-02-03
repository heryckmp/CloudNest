import Search from "@/components/Search";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/UserButton";

export function Header() {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <ThemeToggle />
        <UserButton />
        <SignOutButton />
      </div>
    </header>
  );
}
