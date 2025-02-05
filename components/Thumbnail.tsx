import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

const Thumbnail = ({
  type,
  extension,
  url,
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";
  const defaultIcon = `/assets/icons/file-${type}.svg`;

  return (
    <figure className={cn("relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800", className)}>
      {isImage && url ? (
        <Image
          src={url}
          alt="thumbnail"
          width={100}
          height={100}
          className={cn(
            "h-8 w-8 rounded-full object-cover",
            imageClassName
          )}
          unoptimized={true}
          priority={true}
        />
      ) : (
        <Image
          src={defaultIcon}
          alt="file icon"
          width={100}
          height={100}
          className={cn(
            "h-8 w-8 object-contain",
            imageClassName
          )}
        />
      )}
    </figure>
  );
};

export default Thumbnail;
