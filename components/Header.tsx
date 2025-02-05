import Search from "@/components/Search";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton } from "@/components/UserButton";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  userId: string;
  accountId: string;
}

export default function Header({ userId, accountId }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm dark:bg-gray-900">
      <Search />
      <div className="flex items-center gap-4">
        <Link href="/ai-assistant">
          <Button className="flex items-center gap-2 bg-brand text-white hover:bg-brand/90">
            <Image
              src="/assets/icons/ai.svg"
              alt="AI"
              width={20}
              height={20}
              className="size-5 invert"
            />
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
