import { Card, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useMileStonesQuery } from "../../../../query/sales/deals/milestones.get.query";
import type { MileStone } from "../../../../types/sales/deals/milestones.response";

const MilestoneExpandedRow = ({
  projectId,
  totalAmount,
}: {
  projectId: number;
  totalAmount: number;
}) => {
  const { data: milestoneData } = useMileStonesQuery(projectId);

  console.log("milestonedata", milestoneData);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  const STATUS_OPTIONS = [
    { value: "Not started", color: "default" },
    { value: "In progress", color: "blue" },
    { value: "Construction completed", color: "green" },
    { value: "Invoice generated", color: "gold" },
    { value: "Completed", color: "success" },
  ];
  const milestoneColumns: TableProps<MileStone>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Amount",
      dataIndex: "milestone_amount",
      key: "milestone_amount",
      render: (value: string | number) =>
        value ? formatCurrency(Number(value)) : "₹0",
    },
    {
      title: "Received Amount",
      dataIndex: "received_amount",
      key: "received_amount",
      render: (value: string | number | null) =>
        value ? formatCurrency(Number(value)) : "₹0",
    },

    {
      title: "Duration",
      key: "duration",
      render: (_: unknown, record: MileStone) => {
        const start = record.created_at
          ? new Date(record.created_at).toLocaleDateString()
          : "-";
        const end = record.due_date
          ? new Date(record.due_date).toLocaleDateString()
          : "-";
        return (
          <span>
            {start} → {end}
          </span>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const option = STATUS_OPTIONS.find(
          (item) => item.value.toLowerCase() === status?.toLowerCase(),
        );

        return <Tag color={option?.color ?? "default"}>{status || "-"}</Tag>;
      },
    },
  ];
  const milestones: MileStone[] = milestoneData ?? [];

  const totalReceived = milestones.reduce(
    (sum, m) => sum + (Number(m.received_amount) || 0),
    0,
  );
  const totalValue = totalAmount;

  const balance = totalValue - totalReceived;
  return (
    <Card
      size="small"
      bodyStyle={{ padding: 18 }}
      style={{ background: "#FAFBFD", borderRadius: 10 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 5,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            Milestone history
          </span>
          <span style={{ fontSize: 12, color: "#98A2B3" }}>
            ({milestoneData?.length})
          </span>
        </div>
        <Space size={10} split={<span style={{ color: "#D0D5DD" }}>|</span>}>
          <span style={{ fontSize: 13 }}>
            Total <b style={{ marginLeft: 4 }}>{formatCurrency(totalValue)}</b>
          </span>
          <span style={{ fontSize: 13, color: "#0B7A55" }}>
            Received
            <b style={{ marginLeft: 4 }}>{formatCurrency(totalReceived)}</b>
          </span>
          <span style={{ fontSize: 13, color: "#9C5F16" }}>
            Balance
            <b style={{ marginLeft: 4 }}>{formatCurrency(balance)}</b>
          </span>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={milestoneColumns}
        dataSource={milestoneData}
        pagination={false}
        // loading={milestoneLoading}
        size="small"
      />
    </Card>
  );
};
export default MilestoneExpandedRow;
