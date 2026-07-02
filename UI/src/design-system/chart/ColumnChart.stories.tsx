import type { Meta, StoryObj } from "@storybook/react-vite";
import type { EChartsOption } from "echarts";
import Chart from "./index";

const columnGrid = {
  top: 36,
  right: 20,
  bottom: 64,
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

const columnOption: EChartsOption = {
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const points = Array.isArray(params) ? params : [params];
      const first = points[0];

      const vessel = getAxisLabel(first);
      const performance = Array.isArray(first?.value)
        ? first.value[1]
        : (first?.value ?? "-");

      return `Vessel : ${vessel}<br/>Performance : ${performance}`;
    },
  },
  xAxis: {
    type: "category",
    name: "Vessel",
    nameLocation: "middle",
    nameGap: 34,
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    data: [
      "Vessel A",
      "Vessel B",
      "Vessel C",
      "Vessel D",
      "Vessel E",
      "Vessel F",
      "Vessel G",
      "Vessel H",
      "Vessel I",
      "Vessel J",
    ],
  },
  yAxis: {
    type: "value",
    min: 0,
    name: "Performance Index",
    nameGap: 34,
    nameLocation: "middle",
    axisLabel: axisLabelStyle,
    nameTextStyle: axisTitleStyle,
    splitLine: lightSplitLine,
  },
  grid: columnGrid,
  dataZoom: [
    {
      type: "inside",
      xAxisIndex: 0,
      start: 0,
      end: 45,
    },
    {
      type: "slider",
      xAxisIndex: 0,
      height: 16,
      bottom: 8,
      start: 0,
      end: 45,
      showDataShadow: false,
    },
  ],
  series: [
    {
      type: "bar",
      barMaxWidth: 42,
      data: [65, 48, 72, 55, 61, 53, 76, 68, 59, 71],
    },
  ],
};

const meta = {
  title: "Design System/Chart/ColumnChart",
  component: Chart,
  tags: ["autodocs"],
  args: {
    height: 320,
    option: columnOption,
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
