"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  FileCheck,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";

const cheapBrokerIssues = [
  "Аннулируют пропуск через 3 дня",
  "Нет гарантий и договора",
  "Повторная подача — за отдельную плату",
  "Не отвечают после оплаты",
  "Нет временного пропуска на время оформления",
];

const ourAdvantages = [
  {
    icon: Shield,
    title: "10 лет на рынке",
    description: "Работаем с 2016 года. 50 000+ оформленных пропусков.",
  },
  {
    icon: FileCheck,
    title: "Договор и гарантия",
    description:
      "Работаем по договору. Гарантия результата или полный возврат.",
  },
  {
    icon: RefreshCw,
    title: "Повторная подача — бесплатно",
    description:
      "Если получен отказ — подаём снова за свой счёт. 98% одобрение.",
  },
];

export function ReliabilityBlock() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Почему не самый дешёвый —{" "}
            <span className="text-primary">но самый надёжный</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Дешёвые посредники экономят на вашей безопасности. Вот чем
            заканчивается погоня за низкой ценой:
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Cheap brokers — problems */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-destructive/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              <h3 className="text-lg font-bold">Дешёвые посредники</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {cheapBrokerIssues.map((issue) => (
                <li
                  key={issue}
                  className="flex items-start gap-3 text-sm text-foreground/80"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {issue}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg bg-destructive/10 p-3">
              <p className="text-xs text-foreground/60">
                Результат: машина на штрафстоянке, пропуска нет, деньги
                потеряны. Вы платите дважды — сначала посреднику, потом нам за
                срочное оформление.
              </p>
            </div>
          </motion.div>

          {/* Our approach — advantages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-primary">
              <Shield className="size-5" />
              <h3 className="text-lg font-bold">Инфолог24</h3>
            </div>
            <ul className="mt-6 space-y-6">
              {ourAdvantages.map((advantage) => (
                <li key={advantage.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="size-3.5 text-green-700 dark:text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {advantage.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {advantage.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg bg-primary/10 p-3">
              <p className="text-xs text-foreground/60">
                Результат: пропуск оформлен, машина работает, штрафов нет.
                70% клиентов продлевают ежегодно.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
