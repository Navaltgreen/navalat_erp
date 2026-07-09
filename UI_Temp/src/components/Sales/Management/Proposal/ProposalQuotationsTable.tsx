import { Button, Empty, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useMemo } from "react";

import { useQuotationFollowUpMutation } from "../../../../query/sales/management/proposal/quotation-followup.query";
import { useProposalQuotationsQuery } from "../../../../query/sales/management/proposal/quotations.query";
import { showNotification } from "../utils/showNotification";

type ProposalQuotationsTableProps = {
  proposalId: number;
};

function ProposalQuotationsTable({ proposalId }: ProposalQuotationsTableProps) {
  const { data, loading, refetch } = useProposalQuotationsQuery(proposalId);
  const { mutate: followUpQuotationMutate, isPending: isFollowUpPending } =
    useQuotationFollowUpMutation();

  const records = useMemo(() => data?.records ?? [], [data]);

  const columns: TableProps<(typeof records)[number]>["columns"] = [
    {
      title: "Quotation #",
      dataIndex: "quotationNumber",
      key: "quotationNumber",
      render: (value) => value ?? "-",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag color={value === "Approved" ? "green" : "gold"}>
          {value || "-"}
        </Tag>
      ),
    },
    {
      title: "Quotation Status",
      dataIndex: "quotationStatus",
      key: "quotationStatus",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => value || "-",
    },
    {
      title: "PIC",
      dataIndex: "pic",
      key: "pic",
      render: (value) => value || "-",
    },
    {
      title: "Converted Date",
      dataIndex: "convertedDate",
      key: "convertedDate",
      render: (value) => value || "-",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (value) => value || "-",
    },
    {
      title: "Action",
      // title: "Action",
      // title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === "Pending" && (
            <Button
              type="primary"
              size="small"
              loading={isFollowUpPending}
              onClick={() => {
                followUpQuotationMutate(record.id, {
                  onSuccess: async () => {
                    await refetch();
                    showNotification({
                      type: "success",
                      message: "Follow-up Sent",
                      description: `Quotation #${record.quotationNumber ?? record.id} follow-up updated.`,
                    });
                  },
                });
              }}
            >
              Follow Up
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (!loading && records.length === 0) {
    return <Empty description="No quotations found for this proposal" />;
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={records}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}

export default ProposalQuotationsTable;
