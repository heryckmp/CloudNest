"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID, Client, Account } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    // Criar um token OTP por email
    const token = await account.createEmailToken(ID.unique(), email);

    return token.userId;
  } catch (error) {
    handleError(error, "Failed to send email token");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    console.log("Starting account creation for:", email);
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("User already exists, proceeding with OTP");
    }

    console.log("Sending OTP email...");
    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      console.error("Failed to get accountId from sendEmailOTP");
      throw new Error("Failed to send an OTP");
    }
    console.log("OTP sent successfully, accountId:", accountId);

    if (!existingUser) {
      console.log("Creating new user document...");
      const { databases } = await createAdminClient();
      const userId = ID.unique();

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        userId,
        {
          email,
          name: fullName,
          imageUrl: avatarPlaceholderUrl,
          userId,
          accountId,
        },
      );
      console.log("User document created successfully");
    }

    return parseStringify({ accountId });
  } catch (error) {
    console.error("Error in createAccount:", error);
    throw new Error("Failed to create account. Please try again.");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    // Verificar o token OTP e criar a sessão
    const session = await account.createSession(accountId, password);

    if (!session) {
      throw new Error("Failed to create session");
    }

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    });

    // Criar um cliente com a sessão do usuário
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId)
      .setSession(session.secret);

    const userAccount = new Account(client);
    const userInfo = await userAccount.get();

    // Verificar se o usuário já existe no banco de dados
    const { databases } = await createAdminClient();
    const existingUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", userInfo.$id)],
    );

    // Se o usuário não existir, criar um novo documento
    if (existingUser.total === 0) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          name: userInfo.name || userInfo.email.split("@")[0],
          email: userInfo.email,
          imageUrl: avatarPlaceholderUrl,
          userId: userInfo.$id,
          accountId: userInfo.$id,
        }
      );
    }

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Primeiro tenta obter o cliente com a sessão atual
    const { account } = await createSessionClient();
    
    // Tenta obter informações da conta atual
    const currentAccount = await account.get();
    
    if (!currentAccount || !currentAccount.$id) {
      console.log("No account found");
      return null;
    }

    // Se tiver conta, busca o documento do usuário
    const { databases } = await createAdminClient();
    
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!users || users.total === 0) {
      console.log("No user document found");
      return null;
    }

    const user = users.documents[0];
    return parseStringify(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
