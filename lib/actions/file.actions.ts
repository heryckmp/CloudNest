"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query } from "node-appwrite";
import { getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  try {
    const { storage, databases } = await createAdminClient();

    // Upload file to storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      file.name,
      file
    );

    if (!uploadedFile) throw new Error("Failed to upload file");

    const { type, extension } = getFileType(file.name);

    // Create file document
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      uploadedFile.$id,
      {
        name: file.name,
        size: file.size,
        type,
        extension,
        bucketFileId: uploadedFile.$id,
        ownerId,
        accountId,
        users: [accountId],
      }
    );

    revalidatePath(path);
    return true;
  } catch (error) {
    console.error("Error uploading file:", error);
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

    // Adiciona a consulta de tipos apenas se houver tipos especificados
    if (types && types.length > 0) {
      queries.push(Query.equal("type", types));
    }

    // Adiciona a busca por texto se houver
    if (searchText) {
      queries.push(Query.search("name", searchText));
    }

    // Adiciona a ordenação
    queries.push(sortOrder === "asc" ? Query.orderAsc(sortField) : Query.orderDesc(sortField));
    
    // Adiciona o limite
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
