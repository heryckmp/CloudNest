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
    <Link href={fileUrl} target="_blank" className="file-card">
      <div className="flex items-center gap-4">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={fileUrl}
          className="w-12 h-12"
          imageClassName="w-full h-full"
        />

        <div className="flex-1">
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
          <FormattedDateTime
            date={file.$createdAt}
            className="body-2 text-light-100"
          />
          <p className="caption line-clamp-1 text-light-200">
            By: {file.ownerId}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
