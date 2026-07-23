import type { Meta, StoryObj } from "@storybook/react-vite";
import BaseSelect from "./index";

const options = [
  { label: "Fleet 1", value: "fleet-1" },
  { label: "Fleet 2", value: "fleet-2" },
  { label: "Fleet 3", value: "fleet-3" },
];

const meta = {
  component: BaseSelect,
  tags: ["autodocs"],
  args: {
    style: { width: 280 },
    options,
    placeholder: "Select option",
    allowClear: true,
    showSearch: true,
  },
} satisfies Meta<typeof BaseSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    value: "fleet-2",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    options: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
