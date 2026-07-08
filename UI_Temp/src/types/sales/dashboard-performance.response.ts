export type DashboardPerformanceItemResponse = {
  label: string;
  value: number;
};

export type DashboardPerformanceApiResponse = {
  success: boolean;
  message: string;
  data: {
    chart_data: DashboardPerformanceItemResponse[];
  };
  meta: Record<string, unknown>;
};
