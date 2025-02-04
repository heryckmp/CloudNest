"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }

  return queries;
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

    const queries: string[] = [
      Query.equal("type", types),
      ...(searchText ? [Query.search("name", searchText)] : []),
      Query.orderDesc(sortField),
      Query.limit(limit),
    ];

    if (sortOrder === "asc") {
      queries[queries.length - 2] = Query.orderAsc(sortField);
    }

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
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
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
    handleError(error, "Error calculating total space used:, ");
  }
}
