import { Button, Table, type TableProps } from "antd";
import type { MileStone } from "../../types/sales/deals/milestones.response";
import { useMileStonesQuery } from "../../query/sales/deals/milestones.get.query";
import { Select, Tag } from "antd";
import { CircleCheck, Wallet } from "lucide-react";
import { useState } from "react";
import EditProjectModal from "./EditProjectModal";
import { useAccountsEditMileStones } from "../../query/accounts/milestones.edit.query";
import { showNotification } from "../Sales/Management/utils/showNotification";
import MilestoneExpandedRow from "./MilestoneExpandedRow";
function AccountsTable({ projectId }: { projectId: number }) {
  type SelectedMilestone = {
    milestone_amount: number;
    milestoneId: number;
    projectId: number;
    received_amount: number;
    total_received_amount: number;
  };

  const { data: milestoneData, loading: milestoneLoading } =
    useMileStonesQuery(projectId);
  const { mutate: requestEditMileStoneMutate } = useAccountsEditMileStones();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<SelectedMilestone | null>(null);
  const [expandedRowKey, setExpandedRowKey] = useState<number | null>(null);
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
      dataIndex: "total_received_amount",
      key: "total_received_amount",
      render: (value: string | number) =>
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
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (value: string, record: MileStone) => (
        <Select
          value={value}
          style={{ width: "180px" }}
          // disabled={value === "Completed"}
          options={STATUS_OPTIONS.map((item) => ({
            value: item.value,
            label: <Tag color={item.color}>{item.value}</Tag>,
          }))}
          onChange={(newStatus) => {
            console.log(record.id, newStatus);
            requestEditMileStoneMutate(
              {
                milestoneId: record.id,
                project_id: projectId,
                status: newStatus, // Send the selected status
              },
              {
                onSuccess: () => {
                  showNotification({
                    type: "success",
                    message: "Milestone Updated",
                    description: `Milestone status changed to "${newStatus}".`,
                  });
                },
                onError: () => {
                  showNotification({
                    type: "error",
                    message: "Failed to update milestone",
                    description: `Couldn't change milestone status to "${newStatus}".`,
                  });
                },
              },
            );
          }}
        />
      ),
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (value: string) => (value ? value : "-"),
    },

    {
      title: "Payment",
      dataIndex: "edit",
      key: "edit",
      ellipsis: false,
      fixed: "right",
      width: 140,
      render: (_, record) => {
        const isCompleted = record.status?.toLowerCase() === "completed";
        return (
          <Button
            type="default"
            // shape="round"
            size="small"
            icon={
              isCompleted ? <CircleCheck size={14} /> : <Wallet size={14} />
            }
            disabled={isCompleted}
            onClick={() => {
              setSelectedMilestone({
                milestoneId: record.id,
                projectId,
                received_amount: record.received_amount,
                milestone_amount: record.milestone_amount,
                total_received_amount: record.total_received_amount,
              });
              setIsEditModalOpen(true);
            }}
            style={
              isCompleted
                ? undefined
                : {
                    background: "#E6F1FB",
                    borderColor: "#85B7EB",
                    color: "#0C447C",
                  }
            }
          >
            {isCompleted ? "Paid" : "Record payment"}
          </Button>
        );
      },
    },
  ];
  return (
    <>
      {selectedMilestone && (
        <EditProjectModal
          open={isEditModalOpen}
          project={selectedMilestone}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMilestone(null);
          }}
        />
      )}
      <Table
        title={() => "MileStones"}
        rowKey="id"
        columns={milestoneColumns}
        dataSource={milestoneData}
        pagination={false}
        loading={milestoneLoading}
        size="small"
        expandable={{
          expandedRowRender: (record) => (
            <MilestoneExpandedRow record={record} />
          ),
          expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
          onExpand: (expanded, record) => {
            setExpandedRowKey(expanded ? record.id : null);
          },
        }}
      />
    </>
  );
}

export default AccountsTable;
