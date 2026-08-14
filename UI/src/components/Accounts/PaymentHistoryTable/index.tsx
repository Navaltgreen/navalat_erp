import { DatePicker, Input, Select, Space, Table, type TableProps } from "antd";
import { CalendarCheck, CalendarRange, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import usePaymentHistoryDateFilterStore from "../../../store/accounts/payment_history/dateFilter.store";
import { useAllPaymentHistory } from "../../../query/accounts/payment_history/payment_history.get.query";
interface PaymentHistoryRow {
  id: number;
  received_date: string;
  milestone_due_date: string;
  invoice_no?: string | null;
  invoice_date?: string | null;
  amount: number;
  payment_type?: string | null;
}
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
const PaymentHistoryTable = ({ projectId }: { projectId: number }) => {
  const { RangePicker } = DatePicker;
  const [searchTerm, setSearchTerm] = useState("");
  const [amountSearchTerm, setAmountSearchTerm] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState<string | null>(null);
  const { startDate, endDate, setDateRange, resetDateRange } =
    usePaymentHistoryDateFilterStore();
  const startDateStr = startDate ? startDate.format("YYYY-MM-DD") : null;
  const endDateStr = endDate ? endDate.format("YYYY-MM-DD") : null;
  const { data: paymentData, loading: paymentLoading } = useAllPaymentHistory(
    projectId,
    startDateStr,
    endDateStr,
  );

  // console.log("datt", paymentData?.data);

  const rows: PaymentHistoryRow[] = useMemo(() => {
    const payments = paymentData?.data?.payments ?? [];

    return payments.map((payment, index) => ({
      id: index + 1,
      received_date: payment.received_date, // fixed: was payment_date
      milestone_due_date: payment.milestone_due_date,
      invoice_no: payment.invoice_no,
      invoice_date: payment.invoice_date,
      amount: payment.amount,
      payment_type: payment.payment_type,
    }));
  }, [paymentData]);
  const totalReceived = paymentData?.data?.total_received_amount ?? 0;
  const columns: TableProps<PaymentHistoryRow>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "received_date",
      key: "received_date",
      render: (value: string) => (
        <span style={{ color: "#8C8C8C" }}>{formatDate(value)}</span>
      ),
    },
    {
      title: "Milestone due date",
      dataIndex: "milestone_due_date",
      key: "milestone_due_date",
      render: (value: string) => (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#E6F1FB",
            color: "#0C447C",
            padding: "4px 10px",
            borderRadius: 7,
            fontSize: 12,
          }}
        >
          <CalendarCheck size={14} />
          {formatDate(value)}
        </div>
      ),
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_: unknown, record: PaymentHistoryRow) => {
        if (!record.invoice_no) {
          return <span style={{ color: "#BFBFBF" }}>-</span>;
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
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
                {record.invoice_no}
              </div>
              <div style={{ fontSize: 11, color: "#8C8C8C" }}>
                {formatDate(record.invoice_date)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Amount received",
      dataIndex: "amount",
      key: "amount",
      // align: "right",
      render: (value: number) => (
        <span style={{ fontWeight: 500 }}>{formatCurrency(value)}</span>
      ),
    },

    {
      title: "Payment Type",
      dataIndex: "payment_type",
      key: "payment_type",
      render: (value?: string | null) => (
        <span style={{ color: "#8C8C8C" }}>{value ?? "-"}</span>
      ),
    },
  ];
  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedAmountSearch = amountSearchTerm.trim();

    return rows.filter((row) => {
      if (normalizedSearch) {
        const searchableValues = [
          formatDate(row.received_date),
          row.invoice_no,
          formatDate(row.invoice_date),
        ];
        const matchesSearch = searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );
        if (!matchesSearch) return false;
      }
      if (normalizedAmountSearch) {
        const matchesAmount = String(row.amount).includes(
          normalizedAmountSearch,
        );
        if (!matchesAmount) return false;
      }

      if (invoiceFilter === "with" && !row.invoice_no) return false;
      if (invoiceFilter === "without" && row.invoice_no) return false;

      return true;
    });
  }, [rows, searchTerm, amountSearchTerm, invoiceFilter]);
  return (
    <>
      <Space wrap style={{ marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Search ID, Date,Invoice No,Invoice Date"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 240 }}
        />
        <Input
          allowClear
          placeholder="Amount Received"
          value={amountSearchTerm}
          onChange={(event) => setAmountSearchTerm(event.target.value)}
          style={{ width: 240 }}
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
        <RangePicker
          allowClear
          format="DD MMM YYYY"
          value={startDate && endDate ? [startDate, endDate] : null}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              setDateRange(values[0], values[1]);
            } else {
              resetDateRange();
            }
          }}
          suffixIcon={<CalendarRange size={14} color="#BFBFBF" />}
          style={{ borderRadius: 8 }}
        />
      </Space>

      <Table
        title={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 500, fontSize: 16 }}>
              Payment history
            </span>
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
              <span style={{ fontSize: 12, color: "#237804" }}>
                Total received
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#237804" }}>
                {formatCurrency(totalReceived)}
              </span>
            </div>
          </div>
        )}
        rowKey="id"
        columns={columns}
        // dataSource={rows}
        dataSource={filteredRows}
        loading={paymentLoading}
        // loading={loading}
        pagination={false}
        size="small"
      />
    </>
  );
};

export default PaymentHistoryTable;
