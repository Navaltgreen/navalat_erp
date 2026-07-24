import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useMileStonesQuery } from "../../../../query/sales/deals/milestones.get.query";
import type { MileStone } from "../../../../types/sales/deals/milestones.response";
import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAccountsEditMileStones } from "../../../../query/accounts/milestones.edit.query";

const MilestoneExpandedRow = ({ projectId }: { projectId: number }) => {
  const { data: milestoneData } = useMileStonesQuery(projectId);
  const { mutate: requestEditMileStoneMutate } = useAccountsEditMileStones();
  console.log("milestonedata", milestoneData);
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
              requestEditMileStoneMutate({
                milestoneId: record.id,
                project_id: projectId,
                status: "completed",
              })
            }
          >
            Mark complete
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={milestoneColumns}
      dataSource={milestoneData}
      pagination={false}
      // loading={milestoneLoading}
      size="small"
    />
  );
};
export default MilestoneExpandedRow;
