import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ActionCard } from "@/lib/chat/action-cards";

import { ActionCardList } from "./action-card-list";

const meta = {
  title: "Chat/ActionCardList",
  component: ActionCardList,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[520px] rounded-xl border bg-card p-4">
        <p className="mb-2 text-sm text-muted-foreground">
          Это сообщение от ассистента ИнфоПилот с кнопками действий:
        </p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

const extendAction: ActionCard = {
  kind: "extend_permit",
  permitId: "permit_123",
  vehicleId: "vehicle_456",
  zone: "mkad",
  label: "Продлить пропуск на МКАД",
};

const createAction: ActionCard = {
  kind: "create_order",
  vehicleId: "vehicle_456",
  zone: "ttk",
  permitType: "annual_day",
};

const uploadAction: ActionCard = {
  kind: "upload_document",
  orderId: "order_789",
  documentType: "stts",
  label: "Загрузить СТС",
};

const contactAction: ActionCard = {
  kind: "contact_manager",
  reason: "Нужна консультация по документам",
  priority: "high",
};

const openLinkAction: ActionCard = {
  kind: "open_link",
  href: "/dashboard/permits",
  label: "Все мои пропуска",
};

export const SingleAction: Story = {
  args: { actions: [extendAction] },
};

export const MultipleActions: Story = {
  args: {
    actions: [extendAction, createAction, uploadAction],
  },
};

export const WithContactManager: Story = {
  args: {
    actions: [contactAction, openLinkAction],
  },
};

export const AllKinds: Story = {
  args: {
    actions: [
      extendAction,
      createAction,
      uploadAction,
      { kind: "view_order", orderId: "order_789" },
      { kind: "view_permit", permitId: "permit_123" },
      { kind: "upload_archive", vehicleId: "vehicle_456", zone: "sk" },
      contactAction,
      openLinkAction,
    ],
  },
};

export const Empty: Story = {
  args: { actions: [] },
  render: (args) => (
    <div>
      <ActionCardList {...args} />
      <p className="text-xs text-muted-foreground">
        (компонент возвращает null, когда список пуст)
      </p>
    </div>
  ),
};
