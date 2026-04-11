import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/dal/users";
import { SettingsTabs } from "./_components/settings-tabs";

export const metadata: Metadata = {
  title: "Настройки",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/auth/login");

  return (
    <SettingsTabs
      user={{
        name: user.name ?? "",
        email: user.email,
        phone: user.phone ?? "",
        company: user.company ?? "",
        inn: user.inn ?? "",
        ogrn: user.ogrn ?? "",
      }}
    />
  );
}
