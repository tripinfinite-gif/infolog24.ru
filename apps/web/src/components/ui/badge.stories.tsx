import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
  args: {
    children: "Активен",
    variant: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "На модерации" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Отклонён" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Черновик" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Архив" },
};

export const LinkVariant: Story = {
  name: "Link",
  args: { variant: "link", children: "Подробнее" },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckCircle2 />
        Одобрен
      </>
    ),
  },
};

export const StatusBadges: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <CheckCircle2 />
        Активен
      </Badge>
      <Badge variant="secondary">
        <Clock />
        На согласовании
      </Badge>
      <Badge variant="destructive">
        <XCircle />
        Отклонён
      </Badge>
      <Badge variant="outline">Черновик</Badge>
    </div>
  ),
};
