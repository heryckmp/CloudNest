import { Models } from "node-appwrite";

/**
 * Enumeração dos tipos de arquivo suportados
 * @enum {string}
 */
export enum FileTypes {
  Document = "document",
  Image = "image",
  Video = "video",
  Audio = "audio",
  Other = "other"
}

/**
 * Tipo de ação que pode ser executada em um arquivo
 * @type {string}
 */
export type FileActionType = "rename" | "share" | "delete" | "details" | "download";

/**
 * Interface para as propriedades de upload de arquivo
 * @interface UploadFileProps
 */
export interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

/**
 * Interface para as propriedades de busca de arquivos
 * @interface GetFilesProps
 */
export interface GetFilesProps {
  types: FileTypes[];
  searchText?: string;
  sort?: string;
  limit?: number;
}

/**
 * Interface para as propriedades de renomeação de arquivo
 * @interface RenameFileProps
 */
export interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

/**
 * Interface para as propriedades de atualização de usuários do arquivo
 * @interface UpdateFileUsersProps
 */
export interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}

/**
 * Interface para as propriedades de exclusão de arquivo
 * @interface DeleteFileProps
 */
export interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

/**
 * Interface para resposta da API
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Type guard para verificar se um valor é um tipo de arquivo válido
 * @param {string} type - O tipo a ser verificado
 * @returns {boolean} - Verdadeiro se for um tipo válido
 */
export function isFileType(type: string): type is FileTypes {
  return Object.values(FileTypes).includes(type as FileTypes);
}

/**
 * Type guard para validar um objeto File
 * @param {unknown} file - O objeto a ser validado
 * @returns {boolean} - Verdadeiro se for um File válido
 */
export function validateFile(file: unknown): file is File {
  return file instanceof File;
}

/**
 * Interface para as propriedades do componente FileUploader
 * @interface FileUploaderProps
 */
export interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

/**
 * Interface para as propriedades de thumbnail
 * @interface ThumbnailProps
 */
export interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

/**
 * Tipo para estado de ação de arquivo
 * @type {FileActionType | null}
 */
export type FileActionState = FileActionType | null;

/**
 * Interface para as propriedades de compartilhamento
 * @interface ShareInputProps
 */
export interface ShareInputProps {
  file: Models.Document;
  onInputChange: (emails: string[]) => void;
  onRemove: (email: string) => void;
} 