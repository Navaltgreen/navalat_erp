import {
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { EChartsOption } from "echarts";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  ShoppingCart,
  UserRound,
  XCircle,
} from "lucide-react";
import Chart from "../../../design-system/chart";
import { useSalesDashboardSummaryQuery } from "../../../query/sales/dashboard-summary.query";
import { useThemeStore } from "../../../store/theme";
import type {
  SalesDashboardPicPerformanceResponse,
  SalesDashboardQuarterPicPerformanceResponse,
  SalesDashboardSummaryData,
} from "../../../types/sales/dashboard-summary.response";

const { Text, Title } = Typography;

type MetricChip = {
  label: string;
  value: number | string;
  color: string;
  background: string;
  icon: ReactNode;
};

type MetricCardDefinition = {
  title: string;
  icon: ReactNode;
  iconBackground: string;
  iconColor: string;
  value: (data: SalesDashboardSummaryData) => number;
  subtitle?: (data: SalesDashboardSummaryData) => string;
  chips: (data: SalesDashboardSummaryData) => MetricChip[];
};

function formatCurrency(value: number, compact = false) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(value);

  return `${formattedValue}`;
}

function getMetricCards(): MetricCardDefinition[] {
  return [
    {
      title: "Leads",
      icon: <UserRound size={28} />,
      iconBackground: "rgba(37, 99, 235, 0.12)",
      iconColor: "#2563eb",
      value: (data) => data.cards.lead.total,
      chips: (data) => [
        {
          label: "Converted",
          value: data.cards.lead.converted,
          color: "#65a30d",
          background: "#f2fce2",
          icon: <CheckCircle2 size={14} />,
        },
        {
          label: "Pending",
          value: data.cards.lead.pending,
          color: "#f59e0b",
          background: "#fff7ed",
          icon: <Clock3 size={14} />,
        },
        {
          label: "Declined",
          value: data.cards.lead.declined,
          color: "#ef4444",
          background: "#fef2f2",
          icon: <XCircle size={14} />,
        },
      ],
    },
    {
      title: "Proposals",
      icon: <FileText size={28} />,
      iconBackground: "rgba(20, 184, 166, 0.12)",
      iconColor: "#0ea5a8",
      value: (data) => data.cards.proposal.total,
      chips: (data) => [
        {
          label: "Approved",
          value: data.cards.proposal.approved,
          color: "#65a30d",
          background: "#f2fce2",
          icon: <CheckCircle2 size={14} />,
        },
        {
          label: "Submitted",
          value: data.cards.proposal.submitted,
          color: "#3b82f6",
          background: "#eff6ff",
          icon: <FileText size={14} />,
        },
        {
          label: "Pending",
          value: data.cards.proposal.pending,
          color: "#f59e0b",
          background: "#fff7ed",
          icon: <Clock3 size={14} />,
        },
      ],
    },
    {
      title: "Quotations",
      icon: <CircleDollarSign size={28} />,
      iconBackground: "rgba(147, 51, 234, 0.12)",
      iconColor: "#7c3aed",
      value: (data) => data.cards.quotation.count,
      subtitle: (data) => `${formatCurrency(data.cards.quotation.total_amount)} total`,
      chips: (data) => [
        {
          label: "Pending",
          value: data.cards.quotation.pending,
          color: "#f59e0b",
          background: "#fff7ed",
          icon: <Clock3 size={14} />,
        },
        {
          label: "Approved",
          value: data.cards.quotation.approved,
          color: "#65a30d",
          background: "#f2fce2",
          icon: <CheckCircle2 size={14} />,
        },
        {
          label: "Declined",
          value: data.cards.quotation.declined,
          color: "#ef4444",
          background: "#fef2f2",
          icon: <XCircle size={14} />,
        },
      ],
    },
    {
      title: "Purchase Orders",
      icon: <ShoppingCart size={28} />,
      iconBackground: "rgba(132, 204, 22, 0.14)",
      iconColor: "#65a30d",
      value: (data) => data.cards.purchase_order.orders,
      subtitle: (data) => `${formatCurrency(data.cards.purchase_order.total_amount)} total`,
      chips: (data) => [
        {
          label: "Avg Order",
          value: data.cards.purchase_order.average_order,
          color: "#06b6d4",
          background: "#ecfeff",
          icon: <CircleDollarSign size={14} />,
        },
      ],
    },
  ];
}

function getPanelStyle(isDark: boolean): CSSProperties {
  return {
    borderRadius: 24,
    background: isDark
      ? "linear-gradient(180deg, rgba(37,37,42,0.96), rgba(24,24,27,0.98))"
      : "#ffffff",
    border: isDark ? "1px solid rgba(82, 82, 91, 0.4)" : "1px solid #eef2f6",
    boxShadow: isDark
      ? "0 18px 42px rgba(0, 0, 0, 0.26)"
      : "0 12px 30px rgba(15, 23, 42, 0.08)",
  };
}

function getSectionTitleStyle(color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    color,
  };
}

function getLegendTextColor(isDark: boolean) {
  return isDark ? "#d4d4d8" : "#667085";
}

function getAxisTextColor(isDark: boolean) {
  return isDark ? "#d4d4d8" : "#475467";
}

function getGridLineColor(isDark: boolean) {
  return isDark ? "#3f3f46" : "#e7edf5";
}

function getPicActivityChartOption(
  items: SalesDashboardPicPerformanceResponse[],
  isDark: boolean,
): EChartsOption {
  return {
    color: ["#2f76ff", "#18c3c8"],
    tooltip: { trigger: "axis" },
    legend: {
      bottom: 0,
      textStyle: { color: getLegendTextColor(isDark) },
    },
    grid: {
      top: 16,
      right: 16,
      bottom: 42,
      left: 40,
    },
    xAxis: {
      type: "category",
      data: items.map((item) => item.pic),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: getGridLineColor(isDark) } },
      axisLabel: { color: getAxisTextColor(isDark) },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: getGridLineColor(isDark), type: "dashed" } },
      axisLabel: { color: getAxisTextColor(isDark) },
    },
    series: [
      {
        name: "Leads",
        type: "bar",
        barWidth: 22,
        data: items.map((item) => item.leads),
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "Proposals",
        type: "bar",
        barWidth: 22,
        data: items.map((item) => item.proposals),
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
    ],
  };
}

function getRevenueComparisonChartOption(
  items: SalesDashboardPicPerformanceResponse[],
  isDark: boolean,
): EChartsOption {
  return {
    color: ["#7c3aed", "#52c41a"],
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => formatCurrency(Number(value ?? 0)),
    },
    legend: {
      bottom: 0,
      textStyle: { color: getLegendTextColor(isDark) },
    },
    grid: {
      top: 16,
      right: 16,
      bottom: 42,
      left: 56,
    },
    xAxis: {
      type: "category",
      data: items.map((item) => item.pic),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: getGridLineColor(isDark) } },
      axisLabel: { color: getAxisTextColor(isDark) },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: getGridLineColor(isDark), type: "dashed" } },
      axisLabel: {
        color: getAxisTextColor(isDark),
        formatter: (value: number) => `${value}`,
      },
    },
    series: [
      {
        name: "Quotation",
        type: "bar",
        barWidth: 22,
        data: items.map((item) => item.quotation_amount),
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "Purchase Order",
        type: "bar",
        barWidth: 22,
        data: items.map((item) => item.purchase_order_amount),
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
    ],
  };
}

function getQuotationStatusChartOption(
  data: SalesDashboardSummaryData,
  isDark: boolean,
): EChartsOption {
  return {
    color: ["#fa8c16", "#52c41a", "#ff4d4f"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: 0,
      icon: "circle",
      textStyle: { color: getLegendTextColor(isDark) },
    },
    series: [
      {
        type: "pie",
        radius: ["62%", "82%"],
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: data.cards.quotation.pending, name: "Pending" },
          { value: data.cards.quotation.approved, name: "Approved" },
          { value: data.cards.quotation.declined, name: "Declined" },
        ],
      },
    ],
  };
}

function MetricChipTag({ chip }: { chip: MetricChip }) {
  const displayValue =
    chip.label === "Avg Order" && typeof chip.value === "number"
      ? formatCurrency(chip.value, true)
      : chip.value;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 10,
        background: chip.background,
        color: chip.color,
        fontSize: 14,
        lineHeight: 1,
        fontWeight: 500,
      }}
    >
      {chip.icon}
      <span>{displayValue}</span>
      <span>{chip.label}</span>
    </span>
  );
}

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div style={getSectionTitleStyle(color)}>
      <span
        style={{
          width: 5,
          height: 28,
          borderRadius: 999,
          background: "#2f76ff",
        }}
      />
      <Title level={3} style={{ margin: 0, color }}>
        {title}
      </Title>
    </div>
  );
}

function MetricCard({
  definition,
  data,
  isDark,
}: {
  definition: MetricCardDefinition;
  data: SalesDashboardSummaryData;
  isDark: boolean;
}) {
  return (
    <Card bordered={false} style={getPanelStyle(isDark)}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <Text
            style={{
              display: "block",
              color: isDark ? "#a1a1aa" : "#8a8f98",
              fontSize: 16,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            {definition.title}
          </Text>
          <Title level={1} style={{ margin: "6px 0 0", color: isDark ? "#fafafa" : "#1f2340" }}>
            {definition.value(data)}
          </Title>
          {definition.subtitle ? (
            <Text style={{ color: isDark ? "#d4d4d8" : "#8a8f98", fontSize: 16 }}>
              {definition.subtitle(data)}
            </Text>
          ) : null}
        </div>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: definition.iconBackground,
            color: definition.iconColor,
            flexShrink: 0,
          }}
        >
          {definition.icon}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 18,
        }}
      >
        {definition.chips(data).map((chip) => (
          <MetricChipTag key={chip.label} chip={chip} />
        ))}
      </div>
    </Card>
  );
}

function QuarterPicHighlights({
  items,
  isDark,
}: {
  items: SalesDashboardQuarterPicPerformanceResponse[];
  isDark: boolean;
}) {
  if (items.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No quarter PIC highlights" />;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item) => (
        <div
          key={`${item.quarter}-${item.pic}`}
          style={{
            padding: 14,
            borderRadius: 16,
            border: `1px solid ${isDark ? "#3f3f46" : "#dcfce7"}`,
            background: isDark ? "rgba(39, 39, 42, 0.75)" : "#f7fff8",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <Text style={{ display: "block", color: isDark ? "#fafafa" : "#1f2340", fontWeight: 600 }}>
                {item.pic}
              </Text>
              <Text style={{ color: isDark ? "#a1a1aa" : "#8a8f98" }}>{item.quarter}</Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text style={{ display: "block", color: "#65a30d", fontWeight: 600 }}>
                {formatCurrency(item.amount)}
              </Text>
              <Text style={{ color: isDark ? "#a1a1aa" : "#8a8f98" }}>{item.orders} orders</Text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SalesSummaryWidget() {
  const mode = useThemeStore((state) => state.mode);
  const { data, loading, error } = useSalesDashboardSummaryQuery();
  const isDark = mode === "dark";
  const metricCards = getMetricCards();
  const quarterSummary = data.quarter_summary[0] ?? null;
  const contentColor = isDark ? "#fafafa" : "#1f2340";
  const mutedColor = isDark ? "#d4d4d8" : "#8a8f98";

  return (
    <div style={{ padding: "8px 0 24px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 28,
          marginBottom: 28,
        //   background: isDark
        //     ? "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)"
        //     : "linear-gradient(135deg, #2f76ff 0%, #1557b9 100%)",
        //   boxShadow: "0 18px 40px rgba(37, 99, 235, 0.24)",
        }}
      >
        {loading && !quarterSummary ? (
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        ) : (
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} lg={14}>
              <Text style={{  fontSize: 18, letterSpacing: 1 }}>
                QUARTER SUMMARY
              </Text>
              <Title level={1} style={{  margin: "10px 0 8px" }}>
                {quarterSummary?.quarter ?? "No quarter data"}
              </Title>
              <Text style={{  fontSize: 18 }}>
                {quarterSummary ? `${quarterSummary.orders} Order${quarterSummary.orders === 1 ? "" : "s"}` : "Awaiting records"}
              </Text>
            </Col>
            <Col xs={24} lg={10}>
              <div style={{ textAlign: "right" }}>
                <Text style={{  fontSize: 18, letterSpacing: 0.6 }}>
                  TOTAL REVENUE
                </Text>
                <Title level={1} style={{  margin: "10px 0 0" }}>
                  {formatCurrency(quarterSummary?.amount ?? 0)}
                </Title>
              </div>
            </Col>
          </Row>
        )}
      </Card>

      <SectionHeader title="Key Metrics" color={contentColor} />
      <Row gutter={[8, 8]} style={{ marginBottom: 28 }}>
        {metricCards.map((definition) => (
          <Col key={definition.title} xs={24} sm={12} xl={6}>
            <MetricCard definition={definition} data={data} isDark={isDark} />
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        <Col xs={24} xl={12}>
          <Card bordered={false} style={getPanelStyle(isDark)}>
            <SectionHeader title="PIC Activity (Leads & Proposals)" color={contentColor} />
            {loading && data.pic_performance.length === 0 ? (
              <Skeleton active paragraph={{ rows: 8 }} title={false} />
            ) : data.pic_performance.length === 0 ? (
              <Empty description="No PIC activity data" />
            ) : (
              <Chart option={getPicActivityChartOption(data.pic_performance, isDark)} height={320} />
            )}
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card bordered={false} style={getPanelStyle(isDark)}>
            <SectionHeader title="PIC Revenue Comparison" color={contentColor} />
            {loading && data.pic_performance.length === 0 ? (
              <Skeleton active paragraph={{ rows: 8 }} title={false} />
            ) : data.pic_performance.length === 0 ? (
              <Empty description="No PIC revenue data" />
            ) : (
              <Chart option={getRevenueComparisonChartOption(data.pic_performance, isDark)} height={320} />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={8}>
          <Card bordered={false} style={{ ...getPanelStyle(isDark), height: "100%" }}>
            <SectionHeader title="Quotation Status" color={contentColor} />
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} title={false} />
            ) : (
              <Chart option={getQuotationStatusChartOption(data, isDark)} height={340} />
            )}
          </Card>
        </Col>

        <Col xs={24} xl={16}>
          <Card bordered={false} style={getPanelStyle(isDark)}>
            <SectionHeader title="PIC Performance Breakdown" color={contentColor} />
            {loading && data.pic_performance.length === 0 ? (
              <Skeleton active paragraph={{ rows: 10 }} title={false} />
            ) : data.pic_performance.length === 0 ? (
              <Empty description="No PIC performance records" />
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(140px, 1.2fr) repeat(4, minmax(90px, 1fr))",
                    gap: 12,
                    padding: "0 16px 14px",
                    color: mutedColor,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  <span>PIC</span>
                  <span>Leads</span>
                  <span>Proposals</span>
                  <span>Quotation Amt</span>
                  <span>PO Amount</span>
                </div>

                <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                  {data.pic_performance.map((item, index) => (
                    <div
                      key={item.pic}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(140px, 1.2fr) repeat(4, minmax(90px, 1fr))",
                        gap: 12,
                        alignItems: "center",
                        padding: "14px 16px",
                        borderRadius: 16,
                        background: isDark ? "rgba(39, 39, 42, 0.8)" : "#f8fafc",
                      }}
                    >
                      <Space size={12}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 999,
                            display: "grid",
                            placeItems: "center",
                            background: index % 2 === 0 ? "#dbeafe" : "#dff7f8",
                            color: index % 2 === 0 ? "#2563eb" : "#0ea5a8",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {item.pic.charAt(0).toUpperCase()}
                        </div>
                        <Text style={{ color: contentColor, fontWeight: 600 }}>{item.pic}</Text>
                      </Space>
                      <Text style={{ color: "#2f76ff", fontWeight: 600 }}>{item.leads}</Text>
                      <Text style={{ color: "#18c3c8", fontWeight: 600 }}>{item.proposals}</Text>
                      <Text style={{ color: "#7c3aed", fontWeight: 600 }}>{formatCurrency(item.quotation_amount)}</Text>
                      <Text style={{ color: "#52c41a", fontWeight: 600 }}>{formatCurrency(item.purchase_order_amount)}</Text>
                    </div>
                  ))}
                </div>

                <Text
                  style={{
                    display: "block",
                    color: mutedColor,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    marginBottom: 14,
                  }}
                >
                  QUARTER PIC HIGHLIGHTS
                </Text>
                <QuarterPicHighlights items={data.quarter_pic_performance} isDark={isDark} />
              </>
            )}
          </Card>
        </Col>
      </Row>

      {error ? (
        <div style={{ marginTop: 20 }}>
          <Text type="danger">Failed to load dashboard summary data.</Text>
        </div>
      ) : null}
    </div>
  );
}

export default SalesSummaryWidget;