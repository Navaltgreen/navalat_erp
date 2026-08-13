import { Button, Descriptions, Flex, Input, Select, Space, Table } from "antd";
import type { TableProps } from "antd";
import { useMemo, useState } from "react";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/quotationphase1/get.query";

import { useSalesPrefiltersQuery } from "../../../../query/sales/management/prefilters.query";
import { useRequestSalesQuotationStatus } from "../../../../query/sales/management/quotationphase1/requestforsalesquotation.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
function QuotationPhaseOneTable() {
  const { mutate: requestQuotationMutate } = useRequestSalesQuotationStatus();
  const { data, loading } = useLeadsQuery();
  const { data: prefilters } = useSalesPrefiltersQuery("quotation");
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
    sales_quotation_number: number;
    amount: string;
    attachments: string;
    status: string | null;
    version: number | null;
    // request_for_sales_quotation: Boolean;
    quotation_status: string | null;
  }
  const [selectedLead, setSelectedLead] = useState<DataType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [picFilter, setPicFilter] = useState<string | null>(null);
  const [amountSearch, setAmountSearch] = useState("");
  const [quotationNumberSearch, setQuotationNumberSearch] = useState("");

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
    const normalizedAmountSearch = amountSearch.trim().toLowerCase();
    const normalizedQuotationNoSearch = quotationNumberSearch
      .trim()
      .toLowerCase();

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
        normalizedAmountSearch &&
        !String(record.amount ?? "")
          .toLowerCase()
          .includes(normalizedAmountSearch)
      ) {
        return false;
      }

      if (
        normalizedQuotationNoSearch &&
        !String(record.sales_quotation_number ?? "")
          .toLowerCase()
          .includes(normalizedQuotationNoSearch)
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

      return true;
    });
  }, [
    records,
    searchTerm,
    divisionFilter,
    clientFilter,
    picFilter,
    amountSearch,
    quotationNumberSearch,
  ]);

  const toggleExpandRow = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const renderAttachmentLink = (attachment?: string) => {
    if (!attachment) {
      return "-";
    }

    return (
      <a href={attachment} target="_blank" rel="noopener noreferrer">
        Open Attachment
      </a>
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
    // {
    //   title: "Division",
    //   dataIndex: "division",
    //   key: "division",
    // },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
    },

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
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    // },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Sales Quotation No.",
      dataIndex: "sales_quotation_number",
      key: "sales_quotation_number",
    },
    {
      title: "PIC",
      dataIndex: "pic",
      key: "pic",
    },
    // {
    //   title: "Attachments",
    //   dataIndex: "attachments",
    //   key: "attachments",
    // },

    // {
    //   title: "Remark",
    //   dataIndex: "remark",
    //   key: "remark",
    //   ellipsis: false,
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   align: "center",
    //   key: "status",

    // },

    {
      title: "Status",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      width: 200,
      render: (_, record) => (
        <Flex gap={4}>
          {record.quotation_status == "Pending" ? (
            <Select
              placeholder="Select Next Phase"
              options={[
                { label: "Quotation Phase 2", value: 2 },
                { label: "Quotation Phase 3", value: 3 },
              ]}
              onChange={(phase) =>
                requestQuotationMutate(
                  {
                    id: record.id,
                    phase,
                  },
                  {
                    onSuccess: () => {
                      showNotification({
                        type: "success",
                        message: "Quotation Updated",
                        description: `${record.name} moved to Phase ${phase}.`,
                      });
                    },
                  },
                )
              }
            />
          ) : (
            <span>{record?.quotation_status ?? "-"}</span>
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
            disabled={record?.quotation_status !== "Pending"}
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
          placeholder="Search amount"
          value={amountSearch}
          onChange={(event) => setAmountSearch(event.target.value)}
          style={{ width: 170 }}
        />
        <Input
          allowClear
          placeholder="Search quotation number"
          value={quotationNumberSearch}
          onChange={(event) => setQuotationNumberSearch(event.target.value)}
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
      </Space>
      <Table<DataType>
        rowKey="id"
        columns={columns}
        size="small"
        dataSource={filteredData}
        scroll={{ x: "auto" }}
        title={() => "Quotation Phase One"}
        loading={loading}
        expandable={{
          expandedRowKeys,
          expandedRowRender: (record) => (
            <Descriptions size="small" column={2} bordered>
              <Descriptions.Item label="Phone">
                {record.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {record.email}
              </Descriptions.Item>
              <Descriptions.Item label="Division">
                {record.division || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Attachments">
                {renderAttachmentLink(record.attachments)}
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

export default QuotationPhaseOneTable;
