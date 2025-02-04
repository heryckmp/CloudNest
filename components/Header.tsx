import Search from "@/components/Search";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/UserButton";
import FileUploader from "@/components/FileUploader";

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
        <FileUploader ownerId={userId} accountId={accountId} className="w-fit" />
        <UserButton userId={userId} accountId={accountId} />
        <SignOutButton />
      </div>
    </header>
  );
}
