import { Button, Table, Flex } from "antd";
import { useState } from "react";
import type { TableProps } from "antd";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/purchase/get.query";

import EditTableModel from "./EditTableModel";
function PurchaseTable() {
  interface DataType {
    id: number;
    name: string;
    title: string;
    date: string;
    division: string;
    client: string;
    email: string;
    phone: string;
    remark: string;
    attachments: string;
    amount: string;
    purchase_order_no: string;
  }

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
      title: "Purchase Order No.",
      dataIndex: "purchase_order_no",
      key: "purchase_order_no",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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

  // const data: DataType[] = [
  //   {
  //     key: 1,
  //     name: "John Smith",
  //     title: "Senior Project Manager",
  //     date: "2026-06-10",
  //     division: "Technology",
  //     client: "Acme Solutions",
  //     amount: "$10,000",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     purchase_order_no: 1234,
  //     attachments: "",
  //   },
  //   {
  //     key: 2,
  //     name: "Sarah Johnson",
  //     title: "Business Development Head",
  //     date: "2026-06-08",
  //     division: "Sales",
  //     client: "Global Ventures",
  //     amount: "$15,000",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     purchase_order_no: 1234,
  //     attachments: "",
  //   },
  //   {
  //     key: 3,
  //     name: "Michael Brown",
  //     title: "Operations Director",
  //     date: "2026-06-05",
  //     division: "Operations",
  //     client: "BlueWave Industries",
  //     amount: "$20,000",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     purchase_order_no: 1234,
  //     attachments: "",
  //   },
  //   {
  //     key: 4,
  //     name: "Emily Davis",
  //     title: "Procurement Manager",
  //     date: "2026-06-02",
  //     division: "Procurement",
  //     client: "NextGen Enterprises",
  //     amount: "$25,000",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     purchase_order_no: 1234,
  //     attachments: "",
  //   },
  //   {
  //     key: 5,
  //     name: "Emily Davis",
  //     title: "Procurement Manager",
  //     date: "2026-06-02",
  //     division: "Procurement",
  //     client: "NextGen Enterprises",
  //     amount: "$30,000",
  //     phone: 9876543210,
  //     email: "john.smith@example.com",
  //     remark: "Interested in enterprise software implementation.",
  //     purchase_order_no: 1234,
  //     attachments: "",
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
        title={() => "Purchase"}
        loading={loading}
      />
    </>
  );
}

export default PurchaseTable;
