"use server";

import { signOutUser } from "./user.actions";

export async function handleSignOut() {
  await signOutUser();
} 