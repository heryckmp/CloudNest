"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

// Define os tipos permitidos para o campo type
type FileType = "image" | "document" | "video" | "audio" | "other";

interface FileError {
  code?: number;
  message?: string;
  type?: string;
  response?: unknown;
}

const getEnumFileType = (type: string): FileType => {
  const typeMap: Record<string, FileType> = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
    'application/pdf': 'document',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'video/mp4': 'video',
    'video/webm': 'video',
    'audio/mpeg': 'audio',
    'audio/wav': 'audio',
    'audio/ogg': 'audio'
  };

  return typeMap[type] || 'other';
};

export const uploadFile = async ({
  file,
  accountId,
  path,
}: Omit<UploadFileProps, 'ownerId'>): Promise<boolean> => {
  try {
    console.log('Starting file upload process with:', {
      bucketId: appwriteConfig.bucketId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const { storage, databases } = await createAdminClient();

    // Upload file to storage
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        file
      );

      if (!uploadedFile) {
        console.error("Failed to upload file to storage - no response from Appwrite");
        return false;
      }

      console.log("File uploaded successfully to storage:", {
        fileId: uploadedFile.$id,
        name: file.name,
        size: file.size
      });

      const { extension } = getFileType(file.name);
      const enumType = getEnumFileType(file.type);

      // Create file document
      try {
        console.log("Attempting to create file document with:", {
          databaseId: appwriteConfig.databaseId,
          collectionId: appwriteConfig.filesCollectionId,
          data: {
            name: file.name,
            size: file.size,
            type: enumType,
            extension,
            bucketFileId: uploadedFile.$id,
            accountId,
            ownerId: accountId,
            users: [accountId]
          }
        });

        const fileDoc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.filesCollectionId,
          ID.unique(),
          {
            name: file.name,
            size: file.size,
            type: enumType,
            extension,
            bucketFileId: uploadedFile.$id,
            accountId,
            ownerId: accountId,
            users: [accountId]
          }
        );

        if (!fileDoc) {
          console.error("Failed to create file document - document is null");
          await storage.deleteFile(appwriteConfig.bucketId, uploadedFile.$id);
          return false;
        }

        console.log("File document created successfully:", {
          docId: fileDoc.$id,
          name: fileDoc.name
        });

        // Revalidate the path to update the UI
        console.log("Revalidating path:", path);
        revalidatePath(path);
        
        return true;
      } catch (dbError) {
        const error = dbError as FileError;
        console.error("Error creating file document:", {
          error,
          code: error.code,
          message: error.message,
          type: error.type,
          response: error.response
        });
        
        // Cleanup: delete the uploaded file since document creation failed
        console.log("Cleaning up uploaded file due to document creation failure");
        await storage.deleteFile(appwriteConfig.bucketId, uploadedFile.$id);
        
        return false;
      }
    } catch (storageError) {
      const error = storageError as FileError;
      console.error("Error uploading file to storage:", {
        error,
        code: error.code,
        message: error.message,
        type: error.type,
        response: error.response
      });
      return false;
    }
  } catch (error) {
    const err = error as FileError;
    console.error("Error in upload process:", {
      error,
      code: err.code,
      message: err.message,
      type: err.type,
      response: err.response,
      fileName: file.name,
      fileSize: file.size
    });
    return false;
  }
};

export const getFiles = async ({
  types,
  searchText = "",
  sort = "$createdAt-desc",
  limit = 9,
}: GetFilesProps) => {
  try {
    const { databases } = await createAdminClient();

    const [sortField, sortOrder] = sort.split("-");
    const queries: string[] = [];

    if (types && types.length > 0) {
      queries.push(Query.equal("type", types));
    }

    if (searchText) {
      queries.push(Query.search("name", searchText));
    }

    queries.push(sortOrder === "asc" ? Query.orderAsc(sortField) : Query.orderDesc(sortField));
    queries.push(Query.limit(limit));

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    return files;
  } catch (error) {
    console.error("Error getting files:", error);
    return null;
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: `${name}.${extension}`,
      }
    );

    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error renaming file:", error);
    return false;
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  try {
    const { databases } = await createAdminClient();

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    );

    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error updating file users:", error);
    return false;
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  try {
    const { storage, databases } = await createAdminClient();

    await Promise.all([
      storage.deleteFile(appwriteConfig.bucketId, bucketFileId),
      databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        fileId
      ),
    ]);

    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.log("User not authenticated");
      return null;
    }

    // Usar o cliente admin para evitar problemas de autorização
    const { databases } = await createAdminClient();

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("accountId", currentUser.accountId)]
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    console.error("Error calculating total space used:", error);
    return null;
  }
}
