import { Button, Flex, Input, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/proposal/get.query";
import { useSalesPrefiltersQuery } from "../../../../query/sales/management/prefilters.query";
import { useRequestSalesProposalStatus } from "../../../../query/sales/management/proposal/requestforsalespropsal.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
import CreateQuotationModal from "./CreateQuotationModal";
import ProposalQuotationsTable from "./ProposalQuotationsTable";
function ProposalTable() {
  // const { data, loading } = useLeadsQuery();
  const { data, loading } = useLeadsQuery();
  const { data: prefilters } = useSalesPrefiltersQuery("proposal");
  const { mutate: requestSalesProposalMutate } =
    useRequestSalesProposalStatus();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateQuotationModalOpen, setIsCreateQuotationModalOpen] =
    useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [picFilter, setPicFilter] = useState<string | null>(null);
  const [proposalStatusFilter, setProposalStatusFilter] = useState<
    string | null
  >(null);
  const [proposalNoSearch, setProposalNoSearch] = useState("");
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
    proposal_status: string;
  }
  const [selectedLead, setSelectedLead] = useState<DataType | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<DataType | null>(
    null,
  );

  const records = useMemo(
    () => (data?.records ?? []) as DataType[],
    [data?.records],
  );

  const divisionOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...prefilters.division,
          ...records
            .map((record) => record.division)
            .filter((value): value is string => Boolean(value)),
        ]),
      ).map((value) => ({ label: value, value })),
    [prefilters.division, records],
  );

  const clientOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...prefilters.client,
          ...records
            .map((record) => record.client)
            .filter((value): value is string => Boolean(value)),
        ]),
      ).map((value) => ({ label: value, value })),
    [prefilters.client, records],
  );

  const picOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...prefilters.picForProposal,
          ...records
            .map((record) => record.pic)
            .filter((value): value is string => Boolean(value)),
        ]),
      ).map((value) => ({ label: value, value })),
    [prefilters.picForProposal, records],
  );

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedProposalNoSearch = proposalNoSearch.trim().toLowerCase();

    return records.filter((record) => {
      if (normalizedSearch) {
        const searchableValues = [record.name, record.title, record.date];
        const matchesSearch = searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

        if (!matchesSearch) {
          return false;
        }
      }

      if (
        normalizedProposalNoSearch &&
        !String(record.proposal_no ?? "")
          .toLowerCase()
          .includes(normalizedProposalNoSearch)
      ) {
        return false;
      }

      if (
        divisionFilter &&
        String(record.division ?? "").toLowerCase() !==
          divisionFilter.toLowerCase()
      ) {
        return false;
      }

      if (
        clientFilter &&
        String(record.client ?? "").toLowerCase() !== clientFilter.toLowerCase()
      ) {
        return false;
      }

      if (
        picFilter &&
        !String(record.pic ?? "")
          .toLowerCase()
          .includes(picFilter.toLowerCase())
      ) {
        return false;
      }

      if (
        proposalStatusFilter &&
        String(record.proposal_status ?? "").toLowerCase() !==
          proposalStatusFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [
    records,
    searchTerm,
    divisionFilter,
    clientFilter,
    picFilter,
    proposalStatusFilter,
    proposalNoSearch,
  ]);

  const toggleExpandRow = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button
          type="link"
          style={{ padding: 0, height: "auto" }}
          onClick={() => toggleExpandRow(record.id)}
        >
          {text}
        </Button>
      ),
    },

    // {
    //   title: "Title",
    //   dataIndex: "title",
    //   key: "title",
    // },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Proposal No.",
      dataIndex: "proposal_no",
      key: "proposal_no",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },
    {
      title: "PIC for Proposal",
      dataIndex: "pic",
      key: "pic",
    },
    // {
    //   title: "Attachments",
    //   dataIndex: "attachments",
    //   key: "attachments",
    // },

    // {
    //   title: "Division",
    //   dataIndex: "division",
    //   key: "division",
    // },

    {
      title: "Proposal Status",
      dataIndex: "proposal_status",
      // fixed: "right",
      width: 120,
      // dataIndex: "lead_status",
      // key: "lead_status",
      key: "proposal_status",
      render: (status) => {
        const colorMap = {
          Pending: "yellow",
          Approved: "green",
          Declined: "red",
          "Proposal Sent": "purple",
          Closed: "success",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap] || "default"}>
            {status === "Approved" ? "Moved to Next Phase" : status}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      // fixed: "right",
      width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          {record.proposal_status !== "Approved" ? (
            <Flex gap={4}>
              <Button
                color="green"
                variant="solid"
                size="medium"
                onClick={() => {
                  setSelectedProposal(record);
                  setIsCreateQuotationModalOpen(true);
                }}
              >
                Create Quotation
              </Button>
              <Button
                color="geekblue"
                variant="solid"
                size="medium"
                onClick={() => {
                  requestSalesProposalMutate(
                    {
                      id: record.id,
                      is_converted: true,
                    },
                    {
                      onSuccess: () => {
                        showNotification({
                          type: "success",
                          message: "Moved to Next Phase",
                          description: `${record.name} moved to the next phase successfully.`,
                        });
                      },
                    },
                  );
                }}
              >
                Move to Next Phase
              </Button>
              {/* <Button
                color="red"
                variant="solid"
                size="medium"
                onClick={() =>
                  requestSalesProposalMutate(
                    {
                      id: record.id,
                      is_converted: false,
                      proposal_status: "Declined",
                    },
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
              </Button> */}
            </Flex>
          ) : (
            <></>
          )}
        </Flex>
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      ellipsis: false,
      // fixed: "right",
      width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          <Button
            type="link"
            icon={<Edit />}
            disabled={record?.proposal_status !== "Pending"}
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
      <CreateQuotationModal
        open={isCreateQuotationModalOpen}
        proposal={selectedProposal}
        onClose={() => {
          setIsCreateQuotationModalOpen(false);
          setSelectedProposal(null);
        }}
      />
      <Space wrap style={{ marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Search name, title, date"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 220 }}
        />
        <Input
          allowClear
          placeholder="Proposal number"
          value={proposalNoSearch}
          onChange={(event) => setProposalNoSearch(event.target.value)}
          style={{ width: 180 }}
        />
        <Select
          allowClear
          placeholder="Proposal status"
          value={proposalStatusFilter ?? undefined}
          onChange={(value) => setProposalStatusFilter(value ?? null)}
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Declined", value: "Declined" },
          ]}
          style={{ width: 180 }}
        />
        <Select
          allowClear
          placeholder="Division"
          value={divisionFilter ?? undefined}
          onChange={(value) => setDivisionFilter(value ?? null)}
          options={divisionOptions}
          style={{ width: 180 }}
        />
        <Select
          allowClear
          placeholder="Client"
          value={clientFilter ?? undefined}
          onChange={(value) => setClientFilter(value ?? null)}
          options={clientOptions}
          style={{ width: 180 }}
        />
        <Select
          allowClear
          placeholder="PIC"
          value={picFilter ?? undefined}
          onChange={(value) => setPicFilter(value ?? null)}
          options={picOptions}
          style={{ width: 200 }}
        />
      </Space>
      <Table<DataType>
        rowKey="id"
        columns={columns}
        size="small"
        dataSource={filteredData}
        scroll={{ x: "auto" }}
        title={() => "Proposal"}
        loading={loading}
        expandable={{
          expandedRowKeys,
          expandedRowRender: (record) => (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <ProposalQuotationsTable proposalId={record.id} />
            </Space>
          ),
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys((prev) =>
                prev.includes(record.id) ? prev : [...prev, record.id],
              );
              return;
            }

            setExpandedRowKeys((prev) => prev.filter((id) => id !== record.id));
          },
        }}
      />
    </>
  );
}

export default ProposalTable;
