"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  try {
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId);

    const cookieStore = await cookies();
    const session = cookieStore.get("appwrite-session");

    if (!session?.value) {
      throw new Error("No session");
    }

    client.setSession(session.value);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
    };
  } catch (error) {
    console.error("Error creating session client:", error);
    throw error;
  }
};

export const createAdminClient = async () => {
  try {
    console.log('Creating admin client with config:', {
      endpoint: appwriteConfig.endpointUrl,
      projectId: appwriteConfig.projectId,
      hasKey: !!appwriteConfig.secretKey,
      databaseId: appwriteConfig.databaseId,
      bucketId: appwriteConfig.bucketId
    });

    if (!appwriteConfig.secretKey) {
      throw new Error('API Key is not configured');
    }

    if (!appwriteConfig.projectId) {
      throw new Error('Project ID is not configured');
    }

    if (!appwriteConfig.bucketId) {
      throw new Error('Bucket ID is not configured');
    }

    const client = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId)
      .setKey(appwriteConfig.secretKey);

    console.log('Admin client created successfully');

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
      get storage() {
        return new Storage(client);
      },
      get avatars() {
        return new Avatars(client);
      },
    };
  } catch (error: any) {
    console.error("Error creating admin client:", {
      error,
      message: error?.message,
      code: error?.code,
      type: error?.type,
      config: {
        hasEndpoint: !!appwriteConfig.endpointUrl,
        hasProjectId: !!appwriteConfig.projectId,
        hasKey: !!appwriteConfig.secretKey,
        hasBucketId: !!appwriteConfig.bucketId,
        hasDatabase: !!appwriteConfig.databaseId
      }
    });
    throw error;
  }
};
