import { Button, Descriptions, Flex, Input, Select, Space, Table } from "antd";
import type { TableProps } from "antd";
import { useMemo, useState } from "react";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/quotationphase3/get.query";
import { useSalesPrefiltersQuery } from "../../../../query/sales/management/prefilters.query";
import { useRequestSalesQuotationStatus } from "../../../../query/sales/management/quotationphase3/requestforsalesquotation.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
function QuotationPhaseThreeTable() {
  interface DataType {
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
    status: string;
    request_for_sales_quotation: boolean;
    quotation_status: string | null;
  }
  const { mutate: requestQuotationMutate } = useRequestSalesQuotationStatus();
  const { data, loading } = useLeadsQuery();
  const { data: prefilters } = useSalesPrefiltersQuery("quotation");
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
      title: "PIC for Quotation",
      dataIndex: "pic",
      key: "pic",
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   align: "center",
    //   key: "status",
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
      title: "Status",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Flex gap={4}>
          {record.quotation_status == "Pending" ? (
            <Button
              color="green"
              variant="solid"
              size="medium"
              onClick={() =>
                requestQuotationMutate(
                  { id: record.id, phase: 4 },
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
      // render: (_, record) => (
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

  // const data: DataType[] = [
  //   {
  //     key: 1,
  //     name: "John Smith",
  //     title: "Senior Project Manager",
  //     date: "2026-06-10",
  //     division: "Technology",
  //     client: "Acme Solutions",
  //     pic: "https://example.com/images/john-smith.jpg",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     sales_quotation_number: 1234,
  //     amount: "$5000",
  //     attachments: "",
  //     status: null,
  //   },
  //   {
  //     key: 2,
  //     name: "Sarah Johnson",
  //     title: "Business Development Head",
  //     date: "2026-06-08",
  //     division: "Sales",
  //     client: "Global Ventures",
  //     pic: "https://example.com/images/john-smith.jpg",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     sales_quotation_number: 1234,
  //     attachments: "",
  //     status: false,
  //     amount: "$5000",
  //   },
  //   {
  //     key: 3,
  //     name: "Michael Brown",
  //     title: "Operations Director",
  //     date: "2026-06-05",
  //     division: "Operations",
  //     client: "BlueWave Industries",
  //     pic: "https://example.com/images/john-smith.jpg",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     sales_quotation_number: 1234,
  //     attachments: "",
  //     status: true,
  //     amount: "$5000",
  //   },
  //   {
  //     key: 4,
  //     name: "Emily Davis",
  //     title: "Procurement Manager",
  //     date: "2026-06-02",
  //     division: "Procurement",
  //     client: "NextGen Enterprises",
  //     pic: "https://example.com/images/john-smith.jpg",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     sales_quotation_number: 1234,
  //     attachments: "",
  //     status: true,
  //     amount: "$5000",
  //   },
  //   {
  //     key: 5,
  //     name: "Emily Davis",
  //     title: "Procurement Manager",
  //     date: "2026-06-02",
  //     division: "Procurement",
  //     client: "NextGen Enterprises",
  //     pic: "https://example.com/images/john-smith.jpg",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     sales_quotation_number: 1234,
  //     attachments: "",
  //     status: true,
  //     amount: "$5000",
  //   },
  // ];
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
        title={() => "Quotation Phase Three"}
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
              {/* <Descriptions.Item label="PIC">{record.pic}</Descriptions.Item> */}
              {/* <Descriptions.Item label="Amount">
                {record.amount}
              </Descriptions.Item> */}
              {/* <Descriptions.Item label="Sales Quotation No.">
                {record.sales_quotation_number}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {record.status}
              </Descriptions.Item> */}
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

export default QuotationPhaseThreeTable;
