import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

export type ChartProps = {
  option: EChartsOption;
  height?: number;
};

function Chart({ option, height = 320 }: ChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      notMerge
      lazyUpdate
    />
  );
}

export default Chart;
