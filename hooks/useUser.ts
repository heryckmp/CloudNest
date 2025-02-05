"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  accountId: string;
  $id?: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
}

interface UseUserProps {
  userId: string;
  accountId: string;
}

export function useUser({ userId, accountId }: UseUserProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser({
            id: userId,
            name: userData.name || "",
            email: userData.email || "",
            imageUrl: userData.imageUrl,
            accountId: accountId,
            ...userData
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId, accountId]);

  return { user, loading };
} 