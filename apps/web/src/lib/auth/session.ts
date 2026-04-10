import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Get the current session from request headers.
 * Returns null if not authenticated.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Require authentication. Throws if not authenticated.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Require a specific role. Throws if not authenticated or wrong role.
 */
export async function requireRole(...roles: string[]) {
  const session = await requireSession();
  const userRole = (session.user as Record<string, unknown>).role as string | undefined;
  if (!userRole || !roles.includes(userRole)) {
    throw new Error("Forbidden");
  }
  return session;
}
