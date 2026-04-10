import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { companyInfo } from "@/content/company";

import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Контакты | Инфологистик-24",
  description:
    "Свяжитесь с нами для оформления пропуска в Москву. Телефон, email, адрес офиса, время работы.",
  openGraph: {
    title: "Контакты | Инфологистик-24",
    description: "Свяжитесь с нами для оформления пропуска в Москву.",
    type: "website",
  },
};

export default function ContactsPage() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Контакты
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Свяжитесь с нами удобным способом — мы ответим в течение 15 минут
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Телефон</h3>
                    <a
                      href={`tel:${companyInfo.contacts.phone.replace(/[^\d+]/g, "")}`}
                      className="text-lg font-semibold text-primary"
                    >
                      {companyInfo.contacts.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a
                      href={`mailto:${companyInfo.contacts.email}`}
                      className="text-primary"
                    >
                      {companyInfo.contacts.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Адрес</h3>
                    <p className="text-muted-foreground">
                      {companyInfo.contacts.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Время работы
                    </h3>
                    <p className="text-muted-foreground">
                      {companyInfo.contacts.workingHours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <MessageCircle className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Мессенджеры
                    </h3>
                    <div className="flex gap-3">
                      {companyInfo.social.map((s) => (
                        <a
                          key={s.name}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {s.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="overflow-hidden rounded-lg border">
              <iframe
                src={`https://yandex.ru/map-widget/v1/?ll=${companyInfo.contacts.coordinates.lng}%2C${companyInfo.contacts.coordinates.lat}&z=14&l=map`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Карта"
              />
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
