import { Button, Table, Tag, Flex } from "antd";
import { useState } from "react";

import type { TableProps } from "antd";
import { Edit, Trash } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/leads/leads_data.query";
import { useDeleteLeadMutation } from "../../../../query/sales/management/leads/delete.query";
import { useRequestProposalStatus } from "../../../../query/sales/management/leads/requestforpropsal.post.query";
import EditTableModel from "./EditTableModel";
import { showNotification } from "../utils/showNotification";

function LeadsTable() {
  const { data, loading } = useLeadsQuery();
  const { mutate: deleteLeadMutate, isPending: isDeleting } =
    useDeleteLeadMutation();
  const { mutate: requestProposalMutate } = useRequestProposalStatus();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  interface DataType {
    id: number;
    serialNumber: number;
    name: string;
    title: string;
    date: string;
    division: string;
    client: string;
    leadStatus: string;
    leadSource: string;
    lastActivity: string;
    email: string;
    phone: string;
    pic: string;
    remark: string;
    requestForProposal: boolean;
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
      title: "Lead Status",
      dataIndex: "leadStatus",
      // dataIndex: "lead_status",
      // key: "lead_status",
      key: "leadStatus",
      render: (status) => {
        const colorMap = {
          New: "blue",
          Contacted: "orange",
          Qualified: "green",
          "Proposal Sent": "purple",
          Closed: "success",
        };

        return (
          <Tag color={colorMap[status as keyof typeof colorMap] || "default"}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Lead Source",
      // dataIndex: "lead_source",
      dataIndex: "leadSource",
      key: "leadSource",
      // key: "lead_source",
    },
    {
      title: "Lead Activity",
      dataIndex: "lastActivity",
      key: "lastActivity",
      // dataIndex: "lead_activity",
      // key: "lead_activity",
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
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      ellipsis: false,
    },
    {
      title: "Request for Proposal",
      // dataIndex: "request_for_proposal",
      dataIndex: "requestForProposal",
      key: "requestForProposal",
      align: "center",
      // key: "request_for_proposal",
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
          {record.requestForProposal == null ? (
            <Flex gap={4}>
              <Button
                color="green"
                variant="solid"
                size="medium"
                onClick={() =>
                  requestProposalMutate(
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
                  requestProposalMutate(
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
          ) : record.requestForProposal ? (
            <></>
            // <Button
            //   color="red"
            //   variant="solid"
            //   size="medium"
            //   onClick={() =>
            //     requestProposalMutate(
            //       { id: record.id, is_converted: false },
            //       {
            //         onSuccess: () => {
            //           showNotification({
            //             type: "error",
            //             message: "Proposal Declined",
            //             description: `${record.name} proposal declined.`,
            //           });
            //         },
            //       },
            //     )
            //   }
            // >
            //   Decline
            // </Button>
          ) : (
            <Button
              color="green"
              variant="solid"
              size="medium"
              onClick={() =>
                requestProposalMutate(
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
      render: (_, record) => {
        return (
          <Flex gap={4}>
            <Button
              type="link"
              icon={<Edit />}
              onClick={() => {
                setSelectedLead(record);
                setIsEditModalOpen(true);
              }}
            >
              {" "}
            </Button>
            <Button
              type="link"
              icon={<Trash />}
              loading={isDeleting}
              onClick={() =>
                deleteLeadMutate(record.id, {
                  onSuccess: () => {
                    showNotification({
                      type: "success",
                      message: "Lead Deleted ",
                      description: `${record.name} Lead deleted successfully.`,
                    });
                  },
                })
              }
            ></Button>
          </Flex>
        );
      },
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
        title={() => "Leads"}
        loading={loading}
      />
    </>
  );
}

export default LeadsTable;
