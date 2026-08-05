import type { Meta, StoryObj } from "@storybook/react-vite";
import type { EChartsOption } from "echarts";
import Chart from "./index";

const baseGrid = {
  top: 36,
  right: 20,
  bottom: 30,
  left: 44,
};

const lightSplitLine = {
  lineStyle: {
    color: "#f3f6fa",
  },
};

const axisLabelStyle = {
  fontSize: 12,
};

const axisTitleStyle = {
  fontSize: 14,
  fontWeight: 600,
};

const scatterOption: EChartsOption = {
  tooltip: {
    trigger: "item",
    formatter: (params) => {
      const point =
        Array.isArray(params) || !Array.isArray(params.value)
          ? []
          : params.value;
      const speed = point[0] ?? "-";
      const fuel = point[1] ?? "-";

      return `Speed : ${speed}<br/>Fuel : ${fuel}`;
    },
  },
  xAxis: {
    type: "value",
    name: "Speed",
    nameLocation: "middle",
    nameGap: 34,
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    splitLine: lightSplitLine,
  },
  yAxis: {
    type: "value",
    min: 0,
    name: "Fuel",
    nameLocation: "middle",
    nameGap: 34,
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    splitLine: lightSplitLine,
  },
  grid: baseGrid,
  series: [
    {
      type: "scatter",
      symbolSize: 12,
      data: [
        [12, 24],
        [15, 30],
        [18, 35],
        [20, 31],
        [23, 40],
        [25, 38],
      ],
    },
  ],
};

const meta = {
  title: "Design System/Chart/ScatterChart",
  component: Chart,
  tags: ["autodocs"],
  args: {
    height: 320,
    option: scatterOption,
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
