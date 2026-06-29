import { Button, Table, Tag, Flex, Select } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/quotationphase2/get.query";
import { useRequestSalesQuotationStatus } from "../../../../query/sales/management/quotationphase2/requestforsalesquotation.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
function QuotationPhaseTwoTable() {
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
  }
  const { mutate: requestQuotationMutate } = useRequestSalesQuotationStatus();
  const { data, loading } = useLeadsQuery();
  const [selectedLead, setSelectedLead] = useState<DataType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
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
      title: "Status",
      dataIndex: "status",
      align: "center",
      key: "status",
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
      width: 200,
      render: (_, record) => (
        <Flex gap={4}>
          {record.request_for_sales_quotation ? (
            <span>Moved to Next Phase</span>
          ) : (
            <Select
              placeholder="Select Next Phase"
              options={[{ label: "Quotation Phase 3", value: 3 }]}
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
      <Table<DataType>
        columns={columns}
        size="small"
        dataSource={(data?.records ?? []) as DataType[]}
        scroll={{ x: 2300 }}
        title={() => "Quotation Phase Two"}
        loading={loading}
      />
    </>
  );
}

export default QuotationPhaseTwoTable;
