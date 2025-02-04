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
  const imageSrc = isImage && url ? url : defaultIcon;

  if (!imageSrc) {
    return (
      <figure className={cn("thumbnail", className)}>
        <Image
          src={defaultIcon}
          alt="file icon"
          width={100}
          height={100}
          className={cn(
            "size-8 object-contain",
            imageClassName
          )}
        />
      </figure>
    );
  }

  return (
    <figure className={cn("thumbnail", className)}>
      {isImage ? (
        <Image
          src={imageSrc}
          alt="thumbnail"
          width={100}
          height={100}
          className={cn(
            "size-8 object-cover rounded-full",
            imageClassName,
            "thumbnail-image"
          )}
          unoptimized={true}
          priority={true}
        />
      ) : (
        <Image
          src={imageSrc}
          alt="file icon"
          width={100}
          height={100}
          className={cn(
            "size-8 object-contain",
            imageClassName
          )}
        />
      )}
    </figure>
  );
};

export default Thumbnail;
