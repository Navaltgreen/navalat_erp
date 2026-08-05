import { Alert, Card, Empty, Select, Space, Table, Tag, Typography } from "antd";
import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import { useSalesDashboardLogsQuery } from "../../../query/sales/dashboard-logs.query";
import type {
  SalesLogItem,
  SalesLogModule,
} from "../../../types/sales/dashboard-logs.response";

const { Title, Text } = Typography;

const moduleOptions: Array<{ label: string; value: SalesLogModule }> = [
  { label: "Leads", value: "lead" },
  { label: "Proposal", value: "proposal" },
  { label: "Quotation", value: "quotation" },
  { label: "Purchase", value: "purchase" },
];

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "pending") {
    return "orange";
  }

  if (
    normalized === "approved" ||
    normalized === "converted" ||
    normalized === "completed" ||
    normalized === "phase_updated"
  ) {
    return "green";
  }

  if (normalized === "declined" || normalized === "rejected") {
    return "red";
  }

  return "blue";
}

function SalesTaskLogs() {
  const [module, setModule] = useState<SalesLogModule>("lead");
  const { data, loading, error } = useSalesDashboardLogsQuery(module);

  const columns: TableColumnsType<SalesLogItem> = useMemo(
    () => [
      {
        title: "Log ID",
        dataIndex: "id",
        key: "id",
        width: 90,
      },
      {
        title: "Work ID",
        dataIndex: "work_id",
        key: "work_id",
        width: 90,
      },
      {
        title: "Work Name",
        dataIndex: "work_name",
        key: "work_name",
        width: 180,
      },
      {
        title: "Previous Status",
        dataIndex: "previous_status",
        key: "previous_status",
        width: 140,
        render: (status: string) => (
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
        ),
      },
      {
        title: "Current Status",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (status: string) => (
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
        ),
      },
      {
        title: "Change Type",
        dataIndex: "change_type",
        key: "change_type",
        width: 130,
        render: (value: string) => value.toUpperCase(),
      },
      {
        title: "Comments",
        dataIndex: "comments",
        key: "comments",
        render: (comments: string | null) => comments ?? "-",
        ellipsis: true,
        width: 280,
      },
      {
        title: "Team Member",
        dataIndex: "team_member",
        key: "team_member",
        render: (member: string | null) => member ?? "-",
        width: 160,
      },
      {
        title: "Changed At",
        dataIndex: "changed_at",
        key: "changed_at",
        render: (changedAt: string) => new Date(changedAt).toLocaleString(),
        width: 190,
      },
    ],
    [],
  );

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Sales Logs
        </Title>
        <Text type="secondary">
          Audit logs for sales modules.
        </Text>
      </div>

      <Card bordered={false}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text strong>Select Module</Text>
            <Select<SalesLogModule>
              style={{ width: 220 }}
              value={module}
              onChange={setModule}
              options={moduleOptions}
            />
          </div>

          {error ? (
            <Alert
              type="error"
              showIcon
              message="Failed to load sales logs"
              description="Please refresh and try again."
            />
          ) : null}

          <Table<SalesLogItem>
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No logs available for selected module" />,
            }}
            scroll={{ x: 1500 }}
          />
        </Space>
      </Card>
    </Space>
  );
}

export default SalesTaskLogs;