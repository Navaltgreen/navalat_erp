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

const getAxisLabel = (point: unknown): string => {
  if (!point || typeof point !== "object") {
    return "-";
  }

  const typedPoint = point as {
    axisValueLabel?: unknown;
    axisValue?: unknown;
  };

  if (typeof typedPoint.axisValueLabel === "string") {
    return typedPoint.axisValueLabel;
  }

  if (
    typeof typedPoint.axisValue === "string" ||
    typeof typedPoint.axisValue === "number"
  ) {
    return String(typedPoint.axisValue);
  }

  return "-";
};

const lineOption: EChartsOption = {
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const points = Array.isArray(params) ? params : [params];
      const first = points[0];

      const month = getAxisLabel(first);
      const fuel = Array.isArray(first?.value)
        ? first.value[1]
        : (first?.value ?? "-");

      return `Month : ${month}<br/>Fuel : ${fuel}`;
    },
  },
  xAxis: {
    type: "category",
    name: "Month",
    nameLocation: "middle",
    nameGap: 34,
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  yAxis: {
    type: "value",
    min: 0,
    name: "Fuel Consumption",
    nameLocation: "middle",
    nameGap: 34,
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    splitLine: lightSplitLine,
  },
  grid: baseGrid,
  series: [
    {
      type: "line",
      smooth: true,
      data: [22, 35, 30, 44, 39, 48],
      areaStyle: { opacity: 0 },
    },
  ],
};

const meta = {
  title: "Design System/Chart/LineChart",
  component: Chart,
  tags: ["autodocs"],
  args: {
    height: 320,
    option: lineOption,
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
