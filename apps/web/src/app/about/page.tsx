import { Award, Bell, Gift, Percent, ShieldCheck, Smile, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";

import { CtaSection } from "@/components/sections/cta-section";
import { Features } from "@/components/sections/features";
import { Stats } from "@/components/sections/stats";
import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/content/company";
import { stats } from "@/content/stats";

export const metadata: Metadata = {
  title: "О компании | Инфологистик-24",
  description: companyInfo.description,
  openGraph: {
    title: "О компании | Инфологистик-24",
    description: companyInfo.description,
    type: "website",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Award,
  TrendingUp,
  ShieldCheck,
  Gift,
  Percent,
  Bell,
  Zap,
  Shield: ShieldCheck,
  Smile,
};

export default function AboutPage() {
  const valuesData = companyInfo.values.map((v) => ({
    icon: iconMap[v.icon] || Award,
    title: v.title,
    description: v.description,
  }));

  const advantagesData = companyInfo.advantages.map((a) => ({
    icon: iconMap[a.icon] || Award,
    title: a.title,
    description: a.description,
  }));

  return (
    <>
      {/* Hero */}
      <section className="bg-primary px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            О компании {companyInfo.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
            {companyInfo.description}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Наша история
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Компания {companyInfo.name} работает с {companyInfo.foundedYear}{" "}
              года. За это время мы помогли тысячам перевозчиков и транспортных
              компаний оформить пропуска для грузового транспорта в Москву.
            </p>
            <p>
              Мы начинали с небольшой команды, которая хорошо знала все тонкости
              работы с Департаментом транспорта. Сегодня в нашей команде{" "}
              {companyInfo.team.count} специалистов, а число оформленных пропусков
              превысило 50 000.
            </p>
            <p>{companyInfo.team.description}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Наша миссия
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {companyInfo.mission}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-center text-2xl font-bold text-foreground sm:text-3xl">
            Наши ценности
          </h2>
          <div className="mt-8">
            <Features features={valuesData} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <Stats stats={stats} />

      {/* Team */}
      <section className="bg-muted/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Команда
          </h2>
          <p className="mt-4 text-muted-foreground">
            {companyInfo.team.count} специалистов, которые ежедневно помогают
            перевозчикам оформлять пропуска
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                role: "Менеджеры по работе с клиентами",
                desc: "Принимают заявки, консультируют, сопровождают весь процесс",
              },
              {
                role: "Специалисты по оформлению",
                desc: "Готовят документы, подают заявки, работают с Дептрансом",
              },
              {
                role: "Юристы",
                desc: "Помогают в сложных случаях, обжалуют штрафы, консультируют",
              },
            ].map((item) => (
              <Card key={item.role}>
                <CardContent className="text-center">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.role}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <Features features={advantagesData} />

      <CtaSection
        heading="Готовы работать с лучшими?"
        description="Оставьте заявку, и мы покажем, как должен работать сервис оформления пропусков."
        ctaText="Оставить заявку"
        ctaHref="/contacts"
      />
    </>
  );
}
