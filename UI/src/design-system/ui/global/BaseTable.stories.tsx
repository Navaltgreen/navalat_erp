import type { Meta, StoryObj } from "@storybook/react-vite";
import BaseTable from "./BaseTable";
import type { BaseTableProps } from "./BaseTable";

const columns: BaseTableProps["columns"] = [
  {
    title: "Vessel",
    dataIndex: "vessel",
    key: "vessel",
    width: 220,
  },
  {
    title: "Fleet",
    dataIndex: "fleet",
    key: "fleet",
    width: 120,
  },
  {
    title: "CII Rank",
    dataIndex: "ciiRank",
    key: "ciiRank",
    align: "right",
  },
  {
    title: "Attained CII",
    dataIndex: "attainedCii",
    key: "attainedCii",
    align: "right",
  },
  {
    title: "Required CII",
    dataIndex: "requiredCii",
    key: "requiredCii",
    align: "right",
  },
];

const dataSource: BaseTableProps["dataSource"] = Array.from(
  { length: 35 },
  (_, index) => {
    const row = index + 1;
    return {
      key: String(row),
      vessel: `MSC Vessel ${row}`,
      fleet: row % 2 === 0 ? "Container" : "Bulker",
      ciiRank: Number((0.8 + row * 0.02).toFixed(2)),
      attainedCii: Number((6.2 + row * 0.3).toFixed(2)),
      requiredCii: Number((5.8 + row * 0.22).toFixed(2)),
    };
  },
);

const meta = {
  title: "Design System/UI/Table/BaseTable",
  component: BaseTable,
  tags: ["autodocs"],
  args: {
    rowKey: "key",
    columns,
    dataSource,
    scroll: { x: 800 },
  },
} satisfies Meta<typeof BaseTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPagination: Story = {
  args: {
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50"],
    },
  },
};

export const WithoutPagination: Story = {
  args: {
    pagination: false,
  },
};
