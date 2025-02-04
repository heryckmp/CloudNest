import Search from "@/components/Search";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/UserButton";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  userId: string;
  accountId: string;
}

export default function Header({ userId, accountId }: HeaderProps) {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <Link href="/ai-assistant">
          <Button className="flex items-center gap-2 primary-btn">
            <img src="/assets/icons/ai.svg" alt="AI" className="w-5 h-5 invert" />
            Assistente IA
          </Button>
        </Link>
        <ThemeToggle />
        <FileUploader ownerId={userId} accountId={accountId} className="w-fit" />
        <UserButton userId={userId} accountId={accountId} />
        <SignOutButton />
      </div>
    </header>
  );
}
