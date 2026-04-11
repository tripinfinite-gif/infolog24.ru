import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { PartnerShell } from "./_components/partner-shell";

export default async function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/partner/login");
  }

  const role = (session.user as Record<string, unknown>).role as
    | string
    | undefined;

  if (role !== "partner") {
    redirect("/partner/login");
  }

  const user = {
    name: (session.user.name as string | null | undefined) ?? null,
    email: session.user.email as string,
  };

  return <PartnerShell user={user}>{children}</PartnerShell>;
}
