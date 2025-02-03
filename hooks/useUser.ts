"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
} 