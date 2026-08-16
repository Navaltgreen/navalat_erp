import { Button, Card, Col, Empty, Row, Statistic, Typography } from "antd";
import type { EChartsOption } from "echarts";
import Chart from "../../../design-system/chart";
import { useSalesDashboardPerformanceQuery } from "../../../query/sales/dashboard-performance.query";
import { useThemeStore } from "../../../store/theme";
import type { DashboardModule } from "../../../services/sales/dashboard-performance.service";
import SalesSummaryWidget from "./SalesSummaryWidget";
import DashBoardFilters from "./DashBoardFilters";
import { DownloadOutlined } from "@ant-design/icons";
import { useSalesDashboardSummaryQuery } from "../../../query/sales/dashboard-summary.query";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const { Title, Text } = Typography;

type EmployeeCount = {
  name: string;
  count: number;
};

type SalesPhaseChart = {
  key: DashboardModule;
  title: string;
  accent: [string, string, string];
};

const salesPhaseCharts: SalesPhaseChart[] = [
  {
    key: "lead",
    title: "Lead",
    accent: ["#2563eb", "#38bdf8", "#7dd3fc"],
  },
  {
    key: "proposal",
    title: "Proposal",
    accent: ["#0891b2", "#22c55e", "#86efac"],
  },
  {
    key: "quotation",
    title: "Quotation",
    accent: ["#7c3aed", "#a855f7", "#d8b4fe"],
  },
  {
    key: "purchase",
    title: "Deals",
    accent: ["#16a34a", "#4ade80", "#bbf7d0"],
  },
];

function getChartOption(
  phase: SalesPhaseChart,
  employees: EmployeeCount[],
  isDark: boolean,
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: 24,
      right: 16,
      bottom: 28,
      left: 42,
    },
    xAxis: {
      type: "category",
      data: employees.map((employee) => employee.name),
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: isDark ? "#3f3f46" : "#d9dee7",
        },
      },
      axisLabel: {
        color: isDark ? "#d4d4d8" : "#475467",
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: isDark ? "#d4d4d8" : "#475467",
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: isDark ? "#27272a" : "#eef2f6",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: employees.map((employee) => employee.count),
        barWidth: 28,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: phase.accent[0] },
              { offset: 0.5, color: phase.accent[1] },
              { offset: 1, color: phase.accent[2] },
            ],
          },
        },
        label: {
          show: true,
          position: "top",
          color: isDark ? "#fafafa" : "#0f172a",
          fontWeight: 500,
          fontSize: 12,
        },
      },
    ],
  };
}

function DashboardOptimized() {
  const mode = useThemeStore((state) => state.mode);
  const { data, loading } = useSalesDashboardPerformanceQuery();
  const { data: salesdashboardsummary } = useSalesDashboardSummaryQuery();
  const isDark = mode === "dark";
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    if (!dashboardRef.current) return;

    try {
      setExporting(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = dashboardRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDark ? "#18181b" : "#f5f7fa",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const scale = usableWidth / canvas.width;

      const pagePixelHeight = usableHeight / scale;

      let sourceY = 0;

      while (sourceY < canvas.height) {
        const remainingHeight = canvas.height - sourceY;

        const currentHeight = Math.min(pagePixelHeight, remainingHeight);

        const pageCanvas = document.createElement("canvas");

        pageCanvas.width = canvas.width;
        pageCanvas.height = currentHeight;

        const ctx = pageCanvas.getContext("2d");

        if (!ctx) break;

        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          currentHeight,
          0,
          0,
          canvas.width,
          currentHeight,
        );

        const pageImage = pageCanvas.toDataURL("image/png");

        const imageHeight = currentHeight * scale;

        if (sourceY > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          pageImage,
          "PNG",
          margin,
          margin,
          usableWidth,
          imageHeight,
        );

        sourceY += currentHeight;
      }

      const quarter = salesdashboardsummary?.quarter_summary?.[0]?.quarter;

      const fileName = quarter
        ? `Sales-Dashboard-${quarter.replace("/", "-")}.pdf`
        : "Sales-Dashboard.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to export dashboard:", error);
    } finally {
      setExporting(false);
    }
  };
  const chartDataByModule = (module: DashboardModule): EmployeeCount[] => {
    return (data[module] ?? []).map((item) => ({
      name: item.label,
      count: item.value,
    }));
  };
  const quarterSummary = salesdashboardsummary?.quarter_summary[0] ?? null;
  console.log("salesdashboardsummary", quarterSummary?.quarter);
  return (
    <div ref={dashboardRef}>
      {/* Page header: title + Export, placed above the filters. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Sales Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            {quarterSummary?.quarter
              ? `${quarterSummary?.quarter.split("-")[0]} · FY ${quarterSummary?.quarter.split("-")[1]}`
              : ""}
          </Text>
        </div>

        <Button
          icon={<DownloadOutlined />}
          onClick={handleExport}
          style={{
            height: 40,
            borderRadius: 10,
            paddingInline: 18,
            fontWeight: 600,
            background: isDark ? "#fafafa" : "#1f2340",
            color: isDark ? "#1f2340" : "#fff",
            border: "none",
            boxShadow: "0 6px 16px rgba(31, 35, 64, 0.18)",
          }}
          loading={exporting}
          disabled={exporting}
          data-html2canvas-ignore="true"
        >
          Export
        </Button>
      </div>
      <DashBoardFilters />
      <SalesSummaryWidget />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>
              Sales Phase Employee Charts
            </Title>
            <Text type="secondary">
              Employee-wise counts for lead, proposal, quotation, and purchase.
            </Text>
          </div>
          <Row gutter={[16, 16]}>
            {salesPhaseCharts.map((phase) => {
              const employees = chartDataByModule(phase.key);
              const phaseTotal = employees.reduce(
                (sum, employee) => sum + employee.count,
                0,
              );

              return (
                <Col key={phase.key} xs={24} xl={12}>
                  <Card
                    bordered={false}
                    style={{
                      background: isDark
                        ? "linear-gradient(180deg, rgba(37,37,42,0.9), rgba(24,24,27,0.95))"
                        : "linear-gradient(180deg, #ffffff, #f8fbff)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 12,
                        gap: 12,
                      }}
                    >
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {phase.title}
                        </Title>
                        <Text type="secondary">Employee distribution</Text>
                      </div>
                      <Statistic
                        title="Total"
                        value={phaseTotal}
                        valueStyle={{ fontSize: 24 }}
                      />
                    </div>
                    {employees.length === 0 && !loading ? (
                      <Empty description="No chart data" />
                    ) : (
                      <Chart
                        option={getChartOption(phase, employees, isDark)}
                        height={280}
                      />
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardOptimized;
