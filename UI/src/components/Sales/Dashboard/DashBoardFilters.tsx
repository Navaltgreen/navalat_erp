import { Card, Radio, Select, Space, Typography } from "antd";
import {
  MONTH_OPTIONS,
  QUARTER_OPTIONS,
  YEAR_OPTIONS,
  useDashboardFilterStore,
} from "../../../store/sales/dashboard/dashboard-filter.store";

const DashBoardFilters = () => {
  const year = useDashboardFilterStore((state) => state.year);
  const periodType = useDashboardFilterStore((state) => state.periodType);
  const month = useDashboardFilterStore((state) => state.month);
  const quarter = useDashboardFilterStore((state) => state.quarter);
  const setYear = useDashboardFilterStore((state) => state.setYear);
  const setPeriodType = useDashboardFilterStore((state) => state.setPeriodType);
  const setMonth = useDashboardFilterStore((state) => state.setMonth);
  const setQuarter = useDashboardFilterStore((state) => state.setQuarter);
  const { Text } = Typography;

  return (
    <Card bordered={false} bodyStyle={{ padding: "16px 20px" }}>
      <Space size={16} wrap align="center">
        <Space direction="vertical" size={4}>
          <Text style={{ fontSize: 12 }}>YEAR</Text>
          <Select
            value={year}
            onChange={setYear}
            options={YEAR_OPTIONS}
            style={{ width: 120 }}
          />
        </Space>

        <Space direction="vertical" size={4}>
          <Text style={{ fontSize: 12 }}>PERIOD</Text>
          <Radio.Group
            value={periodType}
            onChange={(event) => setPeriodType(event.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={[
              { label: "Month", value: "month" },
              { label: "Quarterly", value: "quarterly" },
              { label: "Yearly", value: "yearly" },
            ]}
          />
        </Space>

        {periodType === "month" ? (
          <Space direction="vertical" size={4}>
            <Text style={{ fontSize: 12 }}>MONTH</Text>
            <Select
              value={month}
              onChange={setMonth}
              options={MONTH_OPTIONS}
              style={{ width: 120 }}
            />
          </Space>
        ) : null}

        {periodType === "quarterly" ? (
          <Space direction="vertical" size={4}>
            <Text style={{ fontSize: 12 }}>QUARTER</Text>
            <Select
              value={quarter}
              onChange={setQuarter}
              options={QUARTER_OPTIONS}
              style={{ width: 120 }}
            />
          </Space>
        ) : null}

        {periodType === "yearly" ? (
          <div style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 13 }}>
              Showing full year data for <strong>{year}</strong>
            </Text>
          </div>
        ) : null}
      </Space>
    </Card>
  );
};

export default DashBoardFilters;
