import { Alert, Card, Empty, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useSalesDashboardWorksQuery } from "../../../query/sales/dashboard-sales-works.query";
import type { SalesWorkItem } from "../../../types/sales/dashboard-sales-works.response";

const { Title, Text } = Typography;

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "pending") {
    return "orange";
  }

  if (normalized === "approved" || normalized === "completed") {
    return "green";
  }

  if (normalized === "declined" || normalized === "rejected") {
    return "red";
  }

  return "blue";
}

const columns: TableColumnsType<SalesWorkItem> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 90,
  },
  {
    title: "Project ID",
    dataIndex: "project_id",
    key: "project_id",
    width: 110,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 120,
  },
  {
    title: "Subcategory",
    dataIndex: "subcategory",
    key: "subcategory",
    width: 160,
  },
  {
    title: "Tab",
    dataIndex: "tab",
    key: "tab",
    width: 130,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 130,
    render: (status: string) => (
      <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    width: 320,
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    render: (comments: string | null) => comments ?? "-",
    ellipsis: true,
    width: 220,
  },
  {
    title: "Images",
    dataIndex: "images",
    key: "images",
    width: 120,
    render: (images: string[]) => `${images?.length ?? 0}`,
  },
  {
    title: "Team",
    dataIndex: "team",
    key: "team",
    render: (team: SalesWorkItem["team"]) =>
      team?.length ? team.map((item) => item.label).join(", ") : "-",
    ellipsis: true,
    width: 220,
  },
];

function SalesTasks() {
  const { data, loading, error } = useSalesDashboardWorksQuery();

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Sales Tasks
        </Title>
        <Text type="secondary">
          Tasks generated from sales dashboard works.
        </Text>
      </div>

      {error ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load sales tasks"
          description="Please refresh and try again."
        />
      ) : null}

      <Card bordered={false}>
        <Table<SalesWorkItem>
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <Empty description="No sales tasks available" />,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>
    </Space>
  );
}

export default SalesTasks;
