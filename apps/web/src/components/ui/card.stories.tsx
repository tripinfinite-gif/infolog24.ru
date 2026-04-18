import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Пропуск в МКАД</CardTitle>
        <CardDescription>Годовой пропуск, дневной режим</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Оформим и подадим документы за вас. Средний срок — 3–5 рабочих дней.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="accent">Оформить</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader className="border-b">
        <CardTitle>Заявка #12847</CardTitle>
        <CardDescription>Создана 14 апреля 2026</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Детали
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-6">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Зона</dt>
          <dd>ТТК</dd>
          <dt className="text-muted-foreground">Статус</dt>
          <dd>На согласовании</dd>
          <dt className="text-muted-foreground">ТС</dt>
          <dd>А123БВ777</dd>
        </dl>
      </CardContent>
      <CardFooter className="border-t">
        <Button className="w-full">Открыть заявку</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-[240px]">
      <CardHeader>
        <CardDescription>Активные пропуска</CardDescription>
        <CardTitle className="text-3xl">42</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">+3 за последнюю неделю</p>
      </CardContent>
    </Card>
  ),
};
