import { PartnerShell } from "./_components/partner-shell";

export default function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerShell>{children}</PartnerShell>;
}
