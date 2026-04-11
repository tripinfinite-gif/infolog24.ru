import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { PartnerShell } from "./_components/partner-shell";

export default async function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    logger.warn("PartnerPortalLayout: no session → redirect /partner/login");
    redirect("/partner/login");
  }

  const role = (session.user as Record<string, unknown>).role as
    | string
    | undefined;

  logger.info(
    {
      userId: session.user.id,
      email: session.user.email,
      role,
      keys: Object.keys(session.user as Record<string, unknown>),
    },
    "PartnerPortalLayout debug",
  );

  if (role !== "partner") {
    logger.warn(
      { role, userId: session.user.id },
      "PartnerPortalLayout: role !== 'partner' → redirect /partner/login",
    );
    redirect("/partner/login");
  }

  const user = {
    name: (session.user.name as string | null | undefined) ?? null,
    email: session.user.email as string,
  };

  return <PartnerShell user={user}>{children}</PartnerShell>;
}
