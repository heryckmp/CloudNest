import Search from "@/components/Search";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/UserButton";

interface HeaderProps {
  userId: string;
  accountId: string;
}

export default function Header({ userId, accountId }: HeaderProps) {
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
