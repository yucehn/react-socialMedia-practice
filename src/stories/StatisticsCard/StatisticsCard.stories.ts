import type { Meta, StoryObj } from "@storybook/react";
import StatisticsCard from "../../components/StatisticsCard";

const meta = {
  title: "Components/StatisticsCard",
  component: StatisticsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      description: "統計項目陣列，包含 label 和 value",
      control: { type: "object" },
    },
    columns: {
      control: { type: "number", min: 1, max: 6 },
      description: "每列顯示的列數（預設3）",
    },
    className: {
      control: { type: "text" },
      description: "自訂 CSS 類名",
    },
  },
} satisfies Meta<typeof StatisticsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "總文章數", value: 5 },
      { label: "總按讚數", value: 23 },
      { label: "總收藏數", value: 8 },
      { label: "總留言數", value: 12 },
      { label: "平均按讚數", value: 5 },
      { label: "平均留言數", value: 2 },
    ],
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    items: [
      { label: "總文章數", value: 10 },
      { label: "總按讚數", value: 150 },
      { label: "總收藏數", value: 45 },
      { label: "總留言數", value: 89 },
    ],
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    items: [
      { label: "總文章數", value: 8 },
      { label: "總按讚數", value: 64 },
      { label: "總收藏數", value: 32 },
      { label: "總留言數", value: 28 },
    ],
    columns: 4,
  },
};

export const HighEngagement: Story = {
  args: {
    items: [
      { label: "總文章數", value: 10 },
      { label: "總按讚數", value: 150 },
      { label: "總收藏數", value: 45 },
      { label: "總留言數", value: 89 },
      { label: "平均按讚數", value: 15 },
      { label: "平均留言數", value: 9 },
    ],
    columns: 3,
  },
};

export const LowEngagement: Story = {
  args: {
    items: [
      { label: "總文章數", value: 3 },
      { label: "總按讚數", value: 2 },
      { label: "總收藏數", value: 0 },
      { label: "總留言數", value: 1 },
      { label: "平均按讚數", value: 1 },
      { label: "平均留言數", value: 0 },
    ],
    columns: 3,
  },
};
