import { Button, Input, Space, Table, Tooltip, type TableProps } from "antd";
import type { MileStone } from "../../types/sales/deals/milestones.response";
import { useMileStonesQuery } from "../../query/sales/deals/milestones.get.query";
import { Select, Tag } from "antd";
import { CircleCheck, Download, Eye, FileText, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import EditProjectModal from "./EditProjectModal";
import { useAccountsEditMileStones } from "../../query/accounts/milestones.edit.query";
import { showNotification } from "../Sales/Management/utils/showNotification";
import MilestoneExpandedRow from "./MilestoneExpandedRow";
import InvoiceDetails from "./InvoiceDetails";
import { useMileStoneHistory } from "../../query/accounts/milestones.total.get.query";
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
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<SelectedMilestone | null>(null);
  const [invoiceMilestone, setInvoiceMilestone] =
    useState<SelectedMilestone | null>(null);
  const [expandedRowKey, setExpandedRowKey] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<string | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  const formatInvoiceDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const STATUS_OPTIONS = [
    { value: "Not started", color: "default" },
    { value: "In progress", color: "blue" },
    { value: "Construction completed", color: "green" },
    { value: "Invoice generated", color: "gold" },
    { value: "Completed", color: "success" },
  ];
  const records = useMemo(() => milestoneData ?? [], [milestoneData]);
  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      if (normalizedSearch) {
        const searchableValues = [record.id, record.remarks, record.invoice_no];
        const matchesSearch = searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

        if (!matchesSearch) {
          return false;
        }
      }

      if (statusFilter && record.status !== statusFilter) {
        return false;
      }

      if (invoiceFilter === "with" && !record.invoice_no) {
        return false;
      }

      if (invoiceFilter === "without" && record.invoice_no) {
        return false;
      }

      return true;
    });
  }, [records, searchTerm, statusFilter, invoiceFilter]);

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
          disabled={value === "Invoice generated"}
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
                  if (newStatus === "Invoice generated") {
                    setInvoiceMilestone({
                      milestoneId: record.id,
                      projectId,
                      received_amount: record.received_amount,
                      milestone_amount: record.milestone_amount,
                      total_received_amount: record.total_received_amount,
                    });
                    setIsInvoiceModalOpen(true);
                  }
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
      title: "Invoice",
      dataIndex: "invoice_no",
      key: "invoice",
      width: 220,
      render: (_: unknown, record: MileStone) => {
        if (!record.invoice_no && !record.invoice_attachment) {
          return <span style={{ color: "#BFBFBF" }}>-</span>;
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "#FFF1D6",
                color: "#D48806",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={14} />
            </div>

            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>
                {record.invoice_no ?? "-"}
              </div>
              <div style={{ fontSize: 11, color: "#8C8C8C" }}>
                {formatInvoiceDate(record.invoice_date)}
              </div>
            </div>

            {record.invoice_attachment ? (
              <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
                <Tooltip title="View attachment">
                  <Button
                    type="text"
                    size="small"
                    icon={<Eye size={14} />}
                    href={record.invoice_attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </Tooltip>
                <Tooltip title="Download attachment">
                  <Button
                    type="text"
                    size="small"
                    icon={<Download size={14} />}
                    href={record.invoice_attachment}
                    download
                  />
                </Tooltip>
              </div>
            ) : null}
          </div>
        );
      },
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

  const { data: invoiceSummaryData, loading: invoiceSummaryLoading } =
    useMileStoneHistory(projectId);

  console.log("invoiceSummaryData", invoiceSummaryData);

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
      {isInvoiceModalOpen && (
        <InvoiceDetails
          open={isInvoiceModalOpen}
          project={invoiceMilestone}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setInvoiceMilestone(null);
          }}
        />
      )}
      <br></br>
      <Space wrap style={{ marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Search ID, remarks, invoice no"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 240 }}
        />
        <Select
          allowClear
          placeholder="Status"
          value={statusFilter ?? undefined}
          onChange={(value) => setStatusFilter(value ?? null)}
          options={STATUS_OPTIONS.map((item) => ({
            label: item.value,
            value: item.value,
          }))}
          style={{ width: 200 }}
        />
        <Select
          allowClear
          placeholder="Invoice"
          value={invoiceFilter ?? undefined}
          onChange={(value) => setInvoiceFilter(value ?? null)}
          options={[
            { label: "With invoice", value: "with" },
            { label: "Without invoice", value: "without" },
          ]}
          style={{ width: 180 }}
        />
      </Space>
      <Table
        // title={() => "MileStones"}
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 500, fontSize: 16 }}>MileStones</span>

            <Space size={8}>
              <div
                style={{
                  background: "#FFF1D6",
                  border: "1px solid #FFD591",
                  borderRadius: 20,
                  padding: "4px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#873800" }}>Invoiced</span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#873800" }}
                >
                  {invoiceSummaryLoading
                    ? "..."
                    : formatCurrency(
                        invoiceSummaryData?.total_invoiced_amount ?? 0,
                      )}
                </span>
              </div>

              <div
                style={{
                  background: "#F0FBEB",
                  border: "1px solid #B7EB8F",
                  borderRadius: 20,
                  padding: "4px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#237804" }}>Received</span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#237804" }}
                >
                  {invoiceSummaryLoading
                    ? "..."
                    : formatCurrency(
                        invoiceSummaryData?.total_received_amount ?? 0,
                      )}
                </span>
              </div>
            </Space>
          </div>
        )}
        rowKey="id"
        columns={milestoneColumns}
        // dataSource={milestoneData}
        dataSource={filteredData}
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
