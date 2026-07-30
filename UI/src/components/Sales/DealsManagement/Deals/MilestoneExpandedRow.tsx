import { Button, Card, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useMileStonesQuery } from "../../../../query/sales/deals/milestones.get.query";
import type { MileStone } from "../../../../types/sales/deals/milestones.response";
import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAccountsEditMileStones } from "../../../../query/accounts/milestones.edit.query";
import { showNotification } from "../utils/showNotification";
const MilestoneExpandedRow = ({
  projectId,
  totalAmount,
}: {
  projectId: number;
  totalAmount: number;
}) => {
  const { data: milestoneData } = useMileStonesQuery(projectId);
  const { mutate: requestEditMileStoneMutate } = useAccountsEditMileStones();
  console.log("milestonedata", milestoneData);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
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
    // {
    //   title: "Start Date",
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   render: (value: string) =>
    //     value ? new Date(value).toLocaleDateString() : "-",
    // },
    // {
    //   title: "End Date",
    //   dataIndex: "due_date",
    //   key: "due_date",
    //   render: (value: string) =>
    //     value ? new Date(value).toLocaleDateString() : "-",
    // },
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
      title: "Action",
      key: "action",
      render: (_: unknown, record: MileStone) => {
        const isCompleted = record.status === "completed";

        if (isCompleted) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Completed
            </Tag>
          );
        }

        return (
          <Button
            size="small"
            icon={<CheckOutlined />}
            onClick={() =>
              requestEditMileStoneMutate(
                {
                  milestoneId: record.id,
                  project_id: projectId,
                  status: "completed",
                },
                {
                  onSuccess: () => {
                    showNotification({
                      type: "success",
                      message: "Milestone Completed",
                      description: `Milestone marked Completed`,
                    });
                    // onClose();
                  },
                  onError: () => {
                    showNotification({
                      type: "error",
                      message: "Failed to complete milestone",
                      description: `Milestone couldn't completed.`,
                    });
                  },
                },
              )
            }
          >
            Mark complete
          </Button>
        );
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
