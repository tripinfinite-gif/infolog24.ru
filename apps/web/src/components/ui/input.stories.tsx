import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Введите текст",
    type: "text",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "А123БВ777" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "your@email.ru" },
};

export const Phone: Story = {
  args: { type: "tel", placeholder: "+7 (999) 123-45-67" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Заблокировано" },
};

export const ErrorState: Story = {
  name: "Error (aria-invalid)",
  args: {
    defaultValue: "invalid@",
    "aria-invalid": true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="vehicle"
        className="text-sm font-medium text-foreground"
      >
        Госномер транспортного средства
      </label>
      <Input id="vehicle" {...args} placeholder="А123БВ777" />
    </div>
  ),
};
