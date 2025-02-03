"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  accountId: string;
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
        setUser({
          ...userData,
          id: userId,
          accountId: accountId
        });
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