export interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export const stats: Stat[] = [
  {
    value: 10,
    label: "лет на рынке",
    suffix: "+",
  },
  {
    value: 50000,
    label: "оформленных пропусков",
    suffix: "+",
  },
  {
    value: 98,
    label: "одобрение заявок",
    suffix: "%",
  },
  {
    value: 3,
    label: "дня — средний срок оформления",
  },
];
