import { Button, Flex, Table, type TableProps } from "antd";
import type { MileStone } from "../../types/sales/deals/milestones.response";
import { useMileStonesQuery } from "../../query/sales/deals/milestones.get.query";
import { Edit } from "lucide-react";
import { useState } from "react";
import EditProjectModal from "./EditProjectModal";
function AccountsTable({ projectId }: { projectId: number }) {
  type SelectedMilestone = {
    milestoneId: number;
    projectId: number;
    received_amount: number;
  };

  const { data: milestoneData, loading: milestoneLoading } =
    useMileStonesQuery(projectId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<SelectedMilestone | null>(null);
  const milestoneColumns: TableProps<MileStone>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Amount",
      dataIndex: "milestone_amount",
    },
    {
      title: "Received Amount",
      dataIndex: "received_amount",
      key: "received_amount",
    },
    {
      title: "Start Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "End Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (value ? value : "-"),
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (value: string) => (value ? value : "-"),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      ellipsis: false,
      fixed: "right",
      width: 100,
      render: (_, record) => {
        const isCompleted = record.status?.toLowerCase() === "completed";
        return (
          <Flex gap={4}>
            <Button
              type="link"
              icon={<Edit />}
              disabled={isCompleted}
              onClick={() => {
                setSelectedMilestone({
                  milestoneId: record.id,
                  projectId,
                  received_amount: record.received_amount,
                });
                setIsEditModalOpen(true);
              }}
            ></Button>
          </Flex>
        );
      }
         
     
      
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
      />
    </>
  );
}

export default AccountsTable;
