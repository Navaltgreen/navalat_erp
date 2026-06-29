import { Button, Table, Flex, Select } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { Edit } from "lucide-react";
import { useLeadsQuery } from "../../../../query/sales/management/quotationphase1/get.query";

import { useRequestSalesQuotationStatus } from "../../../../query/sales/management/quotationphase1/requestforsalesquotation.post.query";
import { showNotification } from "../utils/showNotification";
import EditTableModel from "./EditTableModel";
function QuotationPhaseOneTable() {
  const { mutate: requestQuotationMutate } = useRequestSalesQuotationStatus();
  const { data, loading } = useLeadsQuery();
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
    request_for_sales_quotation: Boolean;
  }
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
        title={() => "Quotation Phase One"}
        loading={loading}
      />
    </>
  );
}

export default QuotationPhaseOneTable;
