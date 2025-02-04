import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const convertFileToUrl = (file: File): string => URL.createObjectURL(file);

export const convertFileSize = (sizeInBytes: number, digits?: number): string => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes";
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB";
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB";
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB";
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const calculateDegrees = (sizeInBytes: number): number => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024;
  const percentage = (sizeInBytes / totalSizeInBytes) * 360;
  return Number(percentage.toFixed(2));
};

export const calculatePercentage = (sizeInBytes: number): number => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024;
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(1));
};

export const getFileType = (fileName: string): { type: FileType; extension: string } => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (!extension) return { type: 'other', extension: '' };

  const documentExtensions = [
    'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'csv', 'rtf', 'ods',
    'ppt', 'odp', 'md', 'html', 'htm', 'epub', 'pages', 'fig',
    'psd', 'ai', 'indd', 'xd', 'sketch', 'afdesign', 'afphoto'
  ];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac'];

  if (documentExtensions.includes(extension)) return { type: 'document', extension };
  if (imageExtensions.includes(extension)) return { type: 'image', extension };
  if (videoExtensions.includes(extension)) return { type: 'video', extension };
  if (audioExtensions.includes(extension)) return { type: 'audio', extension };

  return { type: 'other', extension };
};

export const formatDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '—';

  const date = new Date(isoString);
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const period = date.getHours() >= 12 ? 'pm' : 'am';
  const time = `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
  
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};

export const getFileIcon = (extension: string | undefined, type: FileType | string): string => {
  switch (extension) {
    case 'pdf':
      return '/assets/icons/file-pdf.svg';
    case 'doc':
      return '/assets/icons/file-doc.svg';
    case 'docx':
      return '/assets/icons/file-docx.svg';
    case 'csv':
      return '/assets/icons/file-csv.svg';
    case 'txt':
      return '/assets/icons/file-txt.svg';
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg';
    case 'svg':
      return '/assets/icons/file-image.svg';
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg';
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg';
    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg';
        case 'document':
          return '/assets/icons/file-document.svg';
        case 'video':
          return '/assets/icons/file-video.svg';
        case 'audio':
          return '/assets/icons/file-audio.svg';
        default:
          return '/assets/icons/file-other.svg';
      }
  }
};

// APPWRITE URL UTILS
export const constructFileUrl = (bucketFileId: string): string => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId: string): string => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

interface SpaceInfo {
  size: number;
  latestDate: string;
}

interface TotalSpace {
  document: SpaceInfo;
  image: SpaceInfo;
  video: SpaceInfo;
  audio: SpaceInfo;
  other: SpaceInfo;
  used: number;
  all: number;
}

interface UsageSummaryItem {
  title: string;
  size: string;
  latestDate: string;
  icon: string;
  url: string;
}

// DASHBOARD UTILS
export const getUsageSummary = (totalSpace: TotalSpace): UsageSummaryItem[] => {
  return [
    {
      title: "Documents",
      size: convertFileSize(totalSpace.document.size),
      latestDate: totalSpace.document.latestDate,
      icon: "/assets/icons/folder-document.svg",
      url: "/documents",
    },
    {
      title: "Images",
      size: convertFileSize(totalSpace.image.size),
      latestDate: totalSpace.image.latestDate,
      icon: "/assets/icons/folder-image.svg",
      url: "/images",
    },
    {
      title: "Media",
      size: convertFileSize(totalSpace.video.size + totalSpace.audio.size),
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "/assets/icons/folder-media.svg",
      url: "/media",
    },
    {
      title: "Others",
      size: convertFileSize(totalSpace.other.size),
      latestDate: totalSpace.other.latestDate,
      icon: "/assets/icons/folder-other.svg",
      url: "/others",
    },
  ];
};

export const getFileTypesParams = (type: string) => {
  switch (type) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
};
