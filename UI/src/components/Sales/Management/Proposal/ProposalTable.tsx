import { Button, Table, Tag, Flex } from "antd";
import { useState } from "react";
import type { TableProps } from "antd";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/proposal/get.query";
import { useRequestSalesProposalStatus } from "../../../../query/sales/management/proposal/requestforsalespropsal.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
function ProposalTable() {
  // const { data, loading } = useLeadsQuery();
  const { data, loading } = useLeadsQuery();
  const { mutate: requestSalesProposalMutate } =
    useRequestSalesProposalStatus();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  interface DataType {
    // key: number;
    id: number;
    name: string;
    title: string;
    date: string;
    division: string;
    client: string;
    email: string;
    phone: string;
    pic: string;
    remark: string;
    proposal_no: number;
    attachments: string;
    request_for_sales_quotation: boolean | null;
  }
  const [selectedLead, setSelectedLead] = useState<DataType | null>(null);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Proposal No.",
      dataIndex: "proposal_no",
      key: "proposal_no",
    },
    {
      title: "PIC for Proposal",
      dataIndex: "pic",
      key: "pic",
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
    },

    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      ellipsis: false,
    },
    {
      title: "Request for Sales Quotation",
      dataIndex: "request_for_sales_quotation",
      align: "center",
      key: "request_for_sales_quotation",
      fixed: "right",
      render: (value: boolean | null) => (
        <Tag
          color={value === true ? "green" : value === false ? "red" : "orange"}
        >
          {value === true ? "YES" : value === false ? "NO" : "PENDING"}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      fixed: "right",
      //   width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          {record.request_for_sales_quotation == null ? (
            <Flex gap={4}>
              <Button
                color="green"
                variant="solid"
                size="medium"
                onClick={() =>
                  requestSalesProposalMutate(
                    { id: record.id, is_converted: true },
                    {
                      onSuccess: () => {
                        showNotification({
                          type: "success",
                          message: "Proposal Approved",
                          description: `${record.name} proposal approved successfully.`,
                        });
                      },
                    },
                  )
                }
              >
                Approve
              </Button>
              <Button
                color="red"
                variant="solid"
                size="medium"
                onClick={() =>
                  requestSalesProposalMutate(
                    { id: record.id, is_converted: false },
                    {
                      onSuccess: () => {
                        showNotification({
                          type: "error",
                          message: "Proposal Declined",
                          description: `${record.name} proposal declined.`,
                        });
                      },
                    },
                  )
                }
              >
                Decline
              </Button>
            </Flex>
          ) : record.request_for_sales_quotation ? (
            <Button
              color="red"
              variant="solid"
              size="medium"
              onClick={() =>
                requestSalesProposalMutate(
                  { id: record.id, is_converted: false },
                  {
                    onSuccess: () => {
                      showNotification({
                        type: "error",
                        message: "Proposal Declined",
                        description: `${record.name} proposal declined.`,
                      });
                    },
                  },
                )
              }
            >
              Decline
            </Button>
          ) : (
            <Button
              color="green"
              variant="solid"
              size="medium"
              onClick={() =>
                requestSalesProposalMutate(
                  { id: record.id, is_converted: true },
                  {
                    onSuccess: () => {
                      showNotification({
                        type: "success",
                        message: "Proposal Approved",
                        description: `${record.name} proposal approved successfully.`,
                      });
                    },
                  },
                )
              }
            >
              Approve
            </Button>
          )}
        </Flex>
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      ellipsis: false,
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          <Button
            type="link"
            icon={<Edit />}
            onClick={() => {
              setSelectedLead(record);
              setIsEditModalOpen(true);
            }}
          ></Button>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <EditTableModel
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editData={selectedLead}
      />
      <Table<DataType>
        columns={columns}
        size="small"
        dataSource={(data?.records ?? []) as DataType[]}
        scroll={{ x: 2300 }}
        title={() => "Proposal"}
        loading={loading}
      />
    </>
  );
}

export default ProposalTable;
