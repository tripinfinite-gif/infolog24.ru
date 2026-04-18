import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, Check, Trash2 } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "accent",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
  args: {
    children: "Оформить пропуск",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { variant: "accent", children: "Акцентная кнопка" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Вторичная" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Удалить заявку" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Подробнее" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Призрачная" },
};

export const LinkVariant: Story = {
  name: "Link",
  args: { variant: "link", children: "Ссылка" },
};

export const SizeSmall: Story = {
  name: "Size: Small",
  args: { size: "sm", children: "Small" },
};

export const SizeLarge: Story = {
  name: "Size: Large",
  args: { size: "lg", children: "Large CTA" },
};

export const Icon: Story = {
  args: { size: "icon", children: <ArrowRight /> },
};

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <Check />
        <span>Подтвердить</span>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Недоступна" },
};

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">
        <Trash2 /> Destructive
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="default">default</Button>
      <Button size="lg">lg</Button>
      <Button size="icon">
        <ArrowRight />
      </Button>
    </div>
  ),
};
