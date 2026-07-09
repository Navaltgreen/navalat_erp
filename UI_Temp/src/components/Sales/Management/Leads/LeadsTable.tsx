import {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Input,
  Skeleton,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import type { TableProps } from "antd";
import { Edit, Trash } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/leads/leads_data.query";
import { useDeleteLeadMutation } from "../../../../query/sales/management/leads/delete.query";
import { useLeadHistoryQuery } from "../../../../query/sales/management/leads/history.query";
import { useSalesPrefiltersQuery } from "../../../../query/sales/management/prefilters.query";
import LeadApproveModal from "./LeadApproveModal";
import EditTableModel from "./EditTableModel";
import { showNotification } from "../utils/showNotification";

const { Text, Title } = Typography;

const phaseColorByKey = {
  lead: "#1677ff",
  proposal: "#52c41a",
  purchase: "#722ed1",
} as const;

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getHistoryCardTitle(phase: string, version: number | null) {
  if (phase === "quotation") {
    return `Quote Phase ${version ?? "-"}`;
  }

  if (phase === "lead") {
    return "Lead";
  }

  if (phase === "proposal") {
    return "Proposal";
  }

  if (phase === "purchase") {
    return "Purchase";
  }

  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

function getHistoryCardBorderColor(phase: string, version: number | null) {
  if (phase === "quotation") {
    if (version === 1) {
      return "#faad14";
    }

    if (version === 2) {
      return "#9254de";
    }

    return "#d46b08";
  }

  return phaseColorByKey[phase as keyof typeof phaseColorByKey] ?? "#8c8c8c";
}

function getStatusTagColor(status: string | null) {
  if (!status) {
    return "default";
  }

  const normalized = status.toLowerCase();

  if (normalized.includes("approved") || normalized.includes("converted")) {
    return "green";
  }

  if (normalized.includes("pending")) {
    return "gold";
  }

  if (normalized.includes("declined") || normalized.includes("rejected")) {
    return "red";
  }

  if (normalized.includes("phase")) {
    return "blue";
  }

  return "default";
}

function getPhaseBadgeLabel(phase: string, version: number | null) {
  if (phase === "quotation") {
    return `Q${version ?? "-"}`;
  }

  return phase.toUpperCase();
}

function renderHistoryField(label: string, value: string) {
  return (
    <div>
      <Text
        style={{
          textTransform: "uppercase",
          letterSpacing: 0.7,
          fontSize: 11,
          color: "#8c8c8c",
          fontWeight: 600,
          display: "block",
        }}
      >
        {label}
      </Text>
      <Text strong>{value}</Text>
    </div>
  );
}

function LeadsTable() {
  const { data, loading } = useLeadsQuery();
  const { mutate: deleteLeadMutate, isPending: isDeleting } =
    useDeleteLeadMutation();
  const { data: prefilters } = useSalesPrefiltersQuery("lead");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [picFilter, setPicFilter] = useState<string | null>(null);
  const [leadStatusFilter, setLeadStatusFilter] = useState<string | null>(null);
  const [historyLead, setHistoryLead] = useState<DataType | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useLeadHistoryQuery(historyDrawerOpen ? (historyLead?.id ?? null) : null);

  interface DataType {
    id: number;
    serialNumber: number;
    name: string;
    title: string;
    priority: string;
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
  const [selectedApproveLead, setSelectedApproveLead] =
    useState<DataType | null>(null);

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
        leadStatusFilter &&
        String(record.leadStatus ?? "").toLowerCase() !==
          leadStatusFilter.toLowerCase()
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
    leadStatusFilter,
  ]);

  const columns: TableProps<DataType>["columns"] = [
    // {
    //   title: "Sl. No",
    //   dataIndex: "serialNumber",
    //   key: "serialNumber",
    //   width: 60,
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (text, record) => (
        <Button
          type="link"
          style={{ padding: 0, height: "auto" }}
          onClick={() => {
            setHistoryLead(record);
            setHistoryDrawerOpen(true);
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 220,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: string) => {
        const normalized = String(priority ?? "").toLowerCase();
        const color =
          normalized === "high"
            ? "red"
            : normalized === "medium"
              ? "gold"
              : normalized === "low"
                ? "green"
                : "default";

        return <Tag color={color}>{priority || "-"}</Tag>;
      },
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
      width: 120,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      width: 180,
    },

    // {
    //   title: "Lead Source",
    //   // dataIndex: "lead_source",
    //   dataIndex: "leadSource",
    //   key: "leadSource",
    //   // key: "lead_source",
    // },
    // {
    //   title: "Lead Activity",
    //   dataIndex: "lastActivity",
    //   key: "lastActivity",
    //   // dataIndex: "lead_activity",
    //   // key: "lead_activity",
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    // },

    // {
    //   title: "Remark",
    //   dataIndex: "remark",
    //   key: "remark",
    //   ellipsis: false,
    // },
    {
      title: "Lead Status",
      dataIndex: "leadStatus",
      // fixed: "right",
      width: 120,
      // dataIndex: "lead_status",
      // key: "lead_status",
      key: "leadStatus",
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
            {status == "Approved" ? "Moved to Next Phase" : status}
          </Tag>
        );
      },
    },
    // {
    //   title: "Request for Proposal",
    //   // dataIndex: "request_for_proposal",
    //   dataIndex: "requestForProposal",
    //   key: "requestForProposal",
    //   align: "center",
    //   // key: "request_for_proposal",
    //   fixed: "right",
    //   render: (value: boolean | null) => (
    //     <Tag
    //       color={value === true ? "green" : value === false ? "red" : "orange"}
    //     >
    //       {value === true ? "YES" : value === false ? "NO" : "PENDING"}
    //     </Tag>
    //   ),
    // },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      // fixed: "right",
      width: 100,
      //   width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          {record?.leadStatus == "Pending" ||
          record?.leadStatus == "Approved" ? (
            <Flex gap={4}>
              <Button
                color="green"
                variant="solid"
                size="medium"
                onClick={() => {
                  setSelectedApproveLead(record);
                  setIsApproveModalOpen(true);
                }}
              >
                Create Proposal
              </Button>
              {/* <Button
                color="red"
                variant="solid"
                size="medium"
                onClick={() =>
                  requestProposalMutate(
                    {
                      id: record.id,
                      is_converted: false,
                      lead_status: "Declined",
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
      render: (_, record) => {
        return (
          <Flex gap={4}>
            <Button
              type="link"
              icon={<Edit />}
              disabled={record?.leadStatus !== "Pending"}
              onClick={() => {
                setSelectedLead(record);
                setIsEditModalOpen(true);
              }}
            ></Button>
            <Button
              type="link"
              icon={<Trash />}
              loading={isDeleting}
              disabled={record?.leadStatus !== "Pending"}
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
      <LeadApproveModal
        open={isApproveModalOpen}
        lead={selectedApproveLead}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedApproveLead(null);
        }}
      />
      <Drawer
        title={
          <Space size={10}>
            <Tag color="blue" style={{ fontWeight: 600 }}>
              Lead History
            </Tag>
            <Text strong style={{ fontSize: 16 }}>
              {historyLead?.name ?? "-"}
            </Text>
          </Space>
        }
        open={historyDrawerOpen}
        onClose={() => {
          setHistoryDrawerOpen(false);
          setHistoryLead(null);
        }}
        placement="right"
        width="100%"
      >
        {historyError ? (
          <Alert
            type="error"
            showIcon
            message="Unable to fetch lead history"
            description="Please try again."
          />
        ) : historyLoading ? (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Space>
        ) : historyData.length === 0 ? (
          <Empty description="No history found for this lead" />
        ) : (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card
              style={{
                borderRadius: 14,
                // background: "linear-gradient(180deg, #f7faff 0%, #ffffff 100%)",
              }}
              bodyStyle={{ padding: "14px 16px" }}
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                <Space wrap>
                  {historyData.map((history) => (
                    <Tag
                      key={`phase-chip-${history.phase}-${history.id}-${history.version ?? 0}`}
                      // color="processing"
                    >
                      {getPhaseBadgeLabel(history.phase, history.version)}
                    </Tag>
                  ))}
                </Space>
                <Text type="secondary">Total Stages: {historyData.length}</Text>
              </Flex>
            </Card>

            <div
              style={{
                width: "100%",
                overflowX: "auto",
                paddingBottom: 12,
              }}
            >
              <Flex
                align="stretch"
                gap={16}
                style={{ minWidth: "max-content" }}
              >
                {historyData.map((history) => {
                  const borderColor = getHistoryCardBorderColor(
                    history.phase,
                    history.version,
                  );

                  const amountValue =
                    history.amount === null
                      ? "-"
                      : history.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        });

                  return (
                    <Card
                      key={`${history.phase}-${history.id}-${history.version ?? 0}`}
                      style={{
                        width: 260,
                        minWidth: 260,
                        height: 460,
                        borderColor,
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderRadius: 14,
                        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
                      }}
                      bodyStyle={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        padding: 20,
                      }}
                    >
                      <Flex justify="space-between" align="center" gap={8}>
                        <Title
                          level={5}
                          style={{
                            margin: 0,
                            textTransform: "uppercase",
                            color: borderColor,
                          }}
                        >
                          {getHistoryCardTitle(history.phase, history.version)}
                        </Title>
                        <Tag
                          bordered={false}
                          color={getStatusTagColor(history.status)}
                        >
                          {history.status ?? "-"}
                        </Tag>
                      </Flex>

                      <div
                        style={{
                          height: "100%",
                          overflowY: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                          paddingRight: 4,
                        }}
                      >
                        {renderHistoryField("Name", history.name ?? "-")}
                        {renderHistoryField(
                          "Created At",
                          formatDateTime(history.createdAt),
                        )}
                        {renderHistoryField(
                          "Converted Date",
                          formatDateTime(history.convertedDate),
                        )}
                        {history.proposalNumber !== null &&
                          renderHistoryField(
                            "Proposal Number",
                            history.proposalNumber,
                          )}
                        {history.quotationNumber !== null &&
                          renderHistoryField(
                            "Quotation Number",
                            history.quotationNumber,
                          )}
                        {history.purchaseOrderNumber !== null &&
                          renderHistoryField(
                            "Purchase Order Number",
                            history.purchaseOrderNumber,
                          )}
                        {history.phase === "quotation" &&
                          renderHistoryField(
                            "Version",
                            history.version === null
                              ? "-"
                              : String(history.version),
                          )}
                        {(history.phase === "quotation" ||
                          history.phase === "purchase") &&
                          renderHistoryField("Amount", amountValue)}
                      </div>
                    </Card>
                  );
                })}
              </Flex>
            </div>
          </Space>
        )}
      </Drawer>
      <Space wrap style={{ marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Search name, title, date"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 220 }}
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
        <Select
          allowClear
          placeholder="Lead status"
          value={leadStatusFilter ?? undefined}
          onChange={(value) => setLeadStatusFilter(value ?? null)}
          options={[
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Declined", value: "Declined" },
          ]}
          style={{ width: 180 }}
        />
      </Space>
      <Table<DataType>
        rowKey="id"
        columns={columns}
        size="small"
        dataSource={filteredData}
        scroll={{ x: "auto" }}
        title={() => "Leads"}
        loading={loading}
        expandable={{
          showExpandColumn: true,
          expandedRowKeys,
          // expandIcon: ({ expanded, onExpand, record }) => (
          //   <Button
          //     type="text"
          //     size="small"
          //     icon={
          //       expanded ? (
          //         <MinusSquareOutlined  />
          //       ) : (
          //         <PlusSquareOutlined  />
          //       )
          //     }
          //     onClick={(event) => onExpand(record, event)}
          //   />
          // ),
          expandedRowRender: (record) => (
            <Descriptions size="small" column={2} bordered>
              <Descriptions.Item label="Phone">
                {record.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {record.email}
              </Descriptions.Item>
              <Descriptions.Item label="PIC">{record.pic}</Descriptions.Item>

              <Descriptions.Item label="Lead Source">
                {record.leadSource}
              </Descriptions.Item>
              <Descriptions.Item label="Remark" span={2}>
                {record.remark || "-"}
              </Descriptions.Item>
            </Descriptions>
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

export default LeadsTable;
