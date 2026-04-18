import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Testimonials } from "./testimonials";

const meta = {
  title: "Sections/Testimonials",
  component: Testimonials,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-background p-6 sm:p-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

const fakeTestimonials = [
  {
    name: "Иван Петров",
    company: 'ООО "Грузоперевозки-М"',
    text: "Оформили годовой пропуск в МКАД за 3 дня, без единой правки. Раньше у нас уходило 2 недели через других посредников.",
    rating: 5,
    source: "yandex" as const,
  },
  {
    name: "Сергей Соколов",
    company: "ИП Соколов С. А.",
    text: "Работаем уже год, всё чётко: звонят, напоминают о продлении, собирают документы сами. Очень удобно.",
    rating: 5,
    source: "2gis" as const,
  },
  {
    name: "Анна Иванова",
    company: 'ООО "Логистика Плюс"',
    text: "Единственный сервис, который взялся за наш сложный случай с ТТК — спецтехника нестандартной конфигурации. Получили пропуск.",
    rating: 5,
    source: "site" as const,
  },
  {
    name: "Дмитрий Козлов",
    company: "Частный перевозчик",
    text: "Быстро, недорого, вежливо. Менеджер Алексей провёл через весь процесс.",
    rating: 4,
    source: "yandex" as const,
  },
  {
    name: "Марина Власова",
    company: 'ООО "СтройТранс"',
    text: "Парк из 12 машин — все пропуска через Инфологистик-24. За 2 года ни одного отказа от ГИБДД.",
    rating: 5,
    source: "2gis" as const,
  },
];

export const Default: Story = {
  args: {
    testimonials: fakeTestimonials,
  },
};

export const ShortList: Story = {
  args: {
    testimonials: fakeTestimonials.slice(0, 2),
  },
};

export const WithMixedRatings: Story = {
  args: {
    testimonials: [
      { ...fakeTestimonials[0], rating: 5 },
      { ...fakeTestimonials[1], rating: 4 },
      { ...fakeTestimonials[2], rating: 3 },
    ],
  },
};

export const WithoutSourceLabels: Story = {
  args: {
    testimonials: fakeTestimonials.map(({ source: _source, ...rest }) => rest),
  },
};
