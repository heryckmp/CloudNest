import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, constructFileUrl } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import { CardSkeleton } from "@/components/CardSkeleton";

interface CardProps {
  file?: Models.Document;
  isLoading?: boolean;
}

const Card = ({ file, isLoading }: CardProps) => {
  if (isLoading) {
    return <CardSkeleton />;
  }

  if (!file) {
    return null;
  }

  const fileUrl = constructFileUrl(file.bucketFileId);

  return (
    <Link href={fileUrl} target="_blank" className="block rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={fileUrl}
          className="h-12 w-12"
          imageClassName="h-full w-full"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold line-clamp-1">{file.name}</p>
          <FormattedDateTime
            date={file.$createdAt}
            className="text-sm text-gray-500 dark:text-gray-400"
          />
          <p className="text-xs line-clamp-1 text-gray-400 dark:text-gray-500">
            By: {file.ownerId}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="text-base font-medium">{convertFileSize(file.size)}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
