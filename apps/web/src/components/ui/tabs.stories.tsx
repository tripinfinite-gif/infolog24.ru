import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="mkad">
      <TabsList>
        <TabsTrigger value="mkad">МКАД</TabsTrigger>
        <TabsTrigger value="ttk">ТТК</TabsTrigger>
        <TabsTrigger value="sk">Садовое</TabsTrigger>
      </TabsList>
      <TabsContent value="mkad" className="mt-4 text-sm">
        Пропуск в пределах Московской кольцевой автодороги. Самая частая зона.
      </TabsContent>
      <TabsContent value="ttk" className="mt-4 text-sm">
        Третье транспортное кольцо — промежуточная зона, чуть строже правила.
      </TabsContent>
      <TabsContent value="sk" className="mt-4 text-sm">
        Садовое кольцо — центр Москвы, максимальные требования к документам.
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList variant="line">
        <TabsTrigger value="active">Активные</TabsTrigger>
        <TabsTrigger value="pending">На согласовании</TabsTrigger>
        <TabsTrigger value="archived">Архив</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="mt-4 text-sm">
        Список активных пропусков (42).
      </TabsContent>
      <TabsContent value="pending" className="mt-4 text-sm">
        В работе у менеджеров (3).
      </TabsContent>
      <TabsContent value="archived" className="mt-4 text-sm">
        Завершённые и истёкшие заявки.
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList>
        <TabsTrigger value="profile">Профиль</TabsTrigger>
        <TabsTrigger value="company">Компания</TabsTrigger>
        <TabsTrigger value="billing">Оплата</TabsTrigger>
        <TabsTrigger value="notifications">Уведомления</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="text-sm">
        Настройки личного профиля.
      </TabsContent>
      <TabsContent value="company" className="text-sm">
        Реквизиты компании.
      </TabsContent>
      <TabsContent value="billing" className="text-sm">
        История платежей.
      </TabsContent>
      <TabsContent value="notifications" className="text-sm">
        Каналы: email / Telegram / SMS.
      </TabsContent>
    </Tabs>
  ),
};
