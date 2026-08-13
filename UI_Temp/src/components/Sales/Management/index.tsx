// import { useMemo, useState } from "react";
// import {
//   Button,
//   Col,
//   DatePicker,

//   Form,
//   Input,
//   Modal,
//   Popconfirm,
//   Row,
//   Space,
//   Table,
//   Tag,
//   Typography,
//   message,
// } from "antd";
// import type { TableColumnsType } from "antd";
// import dayjs, { type Dayjs } from "dayjs";
// import BaseSelect from "../../../design-system/ui/Select";
// import {
//   useCreateSalesLeadMutation,
//   useDeleteSalesRecordMutation,
//   useSalesActionMutation,
//   useSalesRecordsQuery,
//   useUpdateSalesLeadMutation,
// } from "../../../query/sales/management/query";
// import { useAuthStore } from "../../../store/auth/store";
// import { useSalesManagementStore } from "../../../store/sales/management/store";
// import type {
//   SalesRecord,
//   SalesStage,
// } from "../../../types/sales/management.model";

// const { RangePicker } = DatePicker;

// const stageOptions: Array<{ label: string; value: SalesStage }> = [
//   { label: "Leads", value: "leads" },
//   { label: "Proposal", value: "proposal" },
//   { label: "Quotation - Phase 1", value: "quotation_phase_1" },
//   { label: "Quotation - Phase 2", value: "quotation_phase_2" },
//   { label: "Quotation - Phase 3", value: "quotation_phase_3" },
//   { label: "Purchase", value: "purchase" },
// ];

// function formatValue(value: unknown): string {
//   if (value === null || value === undefined || value === "") {
//     return "-";
//   }
//   return String(value);
// }

// function downloadAsCsv(stage: SalesStage, rows: SalesRecord[]): void {
//   const headers = [
//     "id",
//     "slNo",
//     "name",
//     "title",
//     "date",
//     "division",
//     "client",
//     "email",
//     "phone",
//     "remarks",
//     "leadStatus",
//     "leadSource",
//     "lastActivity",
//     "proposalNumber",
//     "picForProposal",
//     "purchaseOrderNumber",
//     "amount",
//   ];

//   const csvLines = [
//     headers.join(","),
//     ...rows.map((row) =>
//       headers
//         .map((header) => {
//           const value = (row as unknown as Record<string, unknown>)[header];
//           const content = formatValue(value).replace(/"/g, '""');
//           return `"${content}"`;
//         })
//         .join(","),
//     ),
//   ];

//   const blob = new Blob([csvLines.join("\n")], {
//     type: "text/csv;charset=utf-8;",
//   });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `sales_${stage}_${dayjs().format("YYYYMMDD_HHmmss")}.csv`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

// function SalesManagement() {
//   const selectedStage = useSalesManagementStore((state) => state.selectedStage);
//   const dateRange = useSalesManagementStore((state) => state.dateRange);
//   const page = useSalesManagementStore((state) => state.page);
//   const pageSize = useSalesManagementStore((state) => state.pageSize);
//   const setSelectedStage = useSalesManagementStore(
//     (state) => state.setSelectedStage,
//   );
//   const setDateRange = useSalesManagementStore((state) => state.setDateRange);
//   const setPage = useSalesManagementStore((state) => state.setPage);
//   const setPageSize = useSalesManagementStore((state) => state.setPageSize);
//   const userRole = useAuthStore((state) => state.user?.role_uid ?? "");
//   const [leadForm] = Form.useForm();
//   const [leadModalOpen, setLeadModalOpen] = useState(false);
//   const [editLeadForm] = Form.useForm();
//   const [editLeadModalOpen, setEditLeadModalOpen] = useState(false);
//   const [editingLeadRecord, setEditingLeadRecord] = useState<SalesRecord | null>(
//     null,
//   );

//   const currentRange: [Dayjs, Dayjs] = [
//     dayjs(dateRange[0]),
//     dayjs(dateRange[1]),
//   ];

//   const startDate = currentRange[0].format("YYYY-MM-DD");
//   const endDate = currentRange[1].format("YYYY-MM-DD");

//   const { loading, data } = useSalesRecordsQuery({
//     stage: selectedStage,
//     startDate,
//     endDate,
//     page,
//     pageSize,
//   });
//   const { deleteRecord, loading: deleteLoading } =
//     useDeleteSalesRecordMutation();
//   const { postAction, loading: actionLoading } = useSalesActionMutation();
//   const { createLead, loading: createLeadLoading } =
//     useCreateSalesLeadMutation();
//   const { updateLead, loading: updateLeadLoading } =
//     useUpdateSalesLeadMutation();

//   const isLeadsStage = selectedStage === "leads";

//   const openLeadModal = () => {
//     leadForm.resetFields();
//     leadForm.setFieldsValue({
//       date: dayjs(),
//     });
//     setLeadModalOpen(true);
//   };

//   const closeLeadModal = () => {
//     setLeadModalOpen(false);
//     leadForm.resetFields();
//   };

//   const openEditLeadModal = (record: SalesRecord) => {
//     setEditingLeadRecord(record);
//     editLeadForm.setFieldsValue({
//       name: record.name,
//       title: record.title ?? undefined,
//       date: record.date ? dayjs(record.date) : undefined,
//       division: record.division ?? undefined,
//       client: record.client ?? undefined,
//       email: record.email ?? undefined,
//       phone: record.phone ?? undefined,
//       remarks: record.remarks ?? undefined,
//       lead_status: record.leadStatus ?? undefined,
//       lead_source: record.leadSource ?? undefined,
//       last_activity: record.lastActivity ? dayjs(record.lastActivity) : undefined,
//       pic: record.pic ?? undefined,
//     });
//     setEditLeadModalOpen(true);
//   };

//   const closeEditLeadModal = () => {
//     setEditLeadModalOpen(false);
//     setEditingLeadRecord(null);
//     editLeadForm.resetFields();
//   };

//   const handleLeadSubmit = async () => {
//     const values = await leadForm.validateFields();

//     try {
//       await createLead({
//         name: values.name,
//         title: values.title ?? null,
//         date: values.date.format("YYYY-MM-DD"),
//         division: values.division ?? null,
//         client: values.client ?? null,
//         email: values.email ?? null,
//         phone: values.phone ?? null,
//         remarks: values.remarks ?? null,
//         lead_status: values.lead_status ?? null,
//         lead_source: values.lead_source ?? null,
//         last_activity: values.last_activity
//           ? values.last_activity.format("YYYY-MM-DD")
//           : null,
//         pic: values.pic ?? null,
//       });
//       message.success("Lead created successfully");
//       closeLeadModal();
//     } catch {
//       message.error("Failed to create lead");
//     }
//   };

//   const handleLeadUpdate = async () => {
//     if (!editingLeadRecord) {
//       return;
//     }

//     const values = await editLeadForm.validateFields();

//     try {
//       await updateLead({
//         id: editingLeadRecord.id,
//         payload: {
//           name: values.name,
//           title: values.title ?? null,
//           date: values.date.format("YYYY-MM-DD"),
//           division: values.division ?? null,
//           client: values.client ?? null,
//           email: values.email ?? null,
//           phone: values.phone ?? null,
//           remarks: values.remarks ?? null,
//           lead_status: values.lead_status ?? null,
//           lead_source: values.lead_source ?? null,
//           last_activity: values.last_activity
//             ? values.last_activity.format("YYYY-MM-DD")
//             : null,
//           pic: values.pic ?? null,
//         },
//       });
//       message.success("Lead updated successfully");
//       closeEditLeadModal();
//     } catch {
//       message.error("Failed to update lead");
//     }
//   };

//   const handleDelete = async (record: SalesRecord) => {
//     try {
//       await deleteRecord({
//         stage: selectedStage,
//         id: record.id,
//       });
//       message.success("Record deleted");
//     } catch {
//       message.error("Failed to delete record");
//     }
//   };

//   const handleAction = async (record: SalesRecord, action: "yes" | "no") => {
//     try {
//       await postAction({
//         stage: selectedStage,
//         action,
//         record,
//         userRole,
//       });
//       message.success(`Action '${action}' saved`);
//     } catch {
//       message.error("Failed to save action");
//     }
//   };

//   const baseColumns: TableColumnsType<SalesRecord> = [
//     { title: "SL No", dataIndex: "slNo", width: 90 },
//     { title: "Name", dataIndex: "name", width: 180 },
//     { title: "Date", dataIndex: "date", width: 130 },
//     { title: "Division", dataIndex: "division", width: 140 },
//     { title: "Client", dataIndex: "client", width: 140 },
//     { title: "Email", dataIndex: "email", width: 220 },
//     { title: "Phone", dataIndex: "phone", width: 150 },
//     {
//       title: "Remarks",
//       dataIndex: "remarks",
//       width: 220,
//       render: (value: string | null) => (
//         <Typography.Text>{formatValue(value)}</Typography.Text>
//       ),
//     },
//   ];

//   const stageColumns: Record<SalesStage, TableColumnsType<SalesRecord>> = {
//     leads: [
//       {
//         title: "Title",
//         dataIndex: "title",
//         width: 140,
//       },
//       {
//         title: "Lead Status",
//         dataIndex: "leadStatus",
//         width: 120,
//         render: (value: string | null) =>
//           value ? <Tag color="blue">{value}</Tag> : "-",
//       },
//       {
//         title: "Lead Source",
//         dataIndex: "leadSource",
//         width: 120,
//       },
//       {
//         title: "Last Activity",
//         dataIndex: "lastActivity",
//         width: 130,
//       },
//       {
//         title: "PIC",
//         dataIndex: "pic",
//         width: 140,
//       },
//     ],
//     proposal: [
//       {
//         title: "Proposal #",
//         dataIndex: "proposalNumber",
//         width: 130,
//       },
//       {
//         title: "PIC For Proposal",
//         dataIndex: "picForProposal",
//         width: 160,
//       },
//       {
//         title: "Lead Ref",
//         dataIndex: "lead",
//         width: 100,
//       },
//     ],
//     quotation_phase_1: [
//       { title: "Quotation #", dataIndex: "quotationNumber", width: 130 },
//     ],
//     quotation_phase_2: [
//       { title: "Quotation #", dataIndex: "quotationNumber", width: 130 },
//     ],
//     quotation_phase_3: [
//       { title: "Quotation #", dataIndex: "quotationNumber", width: 130 },
//     ],
//     purchase: [
//       {
//         title: "PO #",
//         dataIndex: "purchaseOrderNumber",
//         width: 130,
//       },
//       {
//         title: "Amount",
//         dataIndex: "amount",
//         width: 120,
//       },
//       {
//         title: "Quotation Ref",
//         dataIndex: "quotation",
//         width: 120,
//       },
//     ],
//   };

//   const actionColumns: TableColumnsType<SalesRecord> = [
//     {
//       title: "Actions",
//       key: "actions",
//       fixed: "right",
//       width: 250,
//       render: (_value, record) => (
//         <Space>
//           {isLeadsStage ? (
//             <Button size="small" onClick={() => openEditLeadModal(record)}>
//               Edit
//             </Button>
//           ) : null}
//           <Button
//             size="small"
//             type="primary"
//             onClick={() => handleAction(record, "yes")}
//             loading={actionLoading}
//           >
//             Yes
//           </Button>
//           <Button
//             size="small"
//             onClick={() => handleAction(record, "no")}
//             loading={actionLoading}
//           >
//             No
//           </Button>
//           <Popconfirm
//             title="Delete this record?"
//             okText="Delete"
//             cancelText="Cancel"
//             onConfirm={() => handleDelete(record)}
//           >
//             <Button size="small" danger loading={deleteLoading}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const columns = useMemo(
//     () => [...baseColumns, ...stageColumns[selectedStage], ...actionColumns],
//     [selectedStage],
//   );

//   return (
//     <>
//       <Row gutter={[16, 16]}>
//         <Col span={24}>
//           <Row gutter={[16, 16]}>
//             <Col>
//               <BaseSelect
//                 style={{ minWidth: 260 }}
//                 value={selectedStage}
//                 options={stageOptions}
//                 onChange={(value) => {
//                   setSelectedStage(value as SalesStage);
//                   setPage(1);
//                 }}
//               />
//             </Col>
//             <Col>
//               {isLeadsStage ? (
//                 <Button type="primary" onClick={openLeadModal}>
//                   Add Lead
//                 </Button>
//               ) : null}
//               <Modal
//                 title="Add Lead"
//                 open={leadModalOpen}
//                 onCancel={closeLeadModal}
//                 onOk={handleLeadSubmit}
//                 confirmLoading={createLeadLoading}
//                 okText="Create"
//                 destroyOnHidden
//               >
//                 <Form
//                   form={leadForm}
//                   layout="vertical"
//                   initialValues={{ date: dayjs() }}
//                 >
//                   <Form.Item
//                     label="Name"
//                     name="name"
//                     rules={[
//                       { required: true, message: "Please enter the lead name" },
//                     ]}
//                   >
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Title" name="title">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item
//                     label="Date"
//                     name="date"
//                     rules={[
//                       { required: true, message: "Please select the date" },
//                     ]}
//                   >
//                     <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//                   </Form.Item>

//                   <Form.Item label="Division" name="division">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Client" name="client">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Email" name="email">
//                     <Input type="email" />
//                   </Form.Item>

//                   <Form.Item label="Phone" name="phone">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Lead Status" name="lead_status">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Lead Source" name="lead_source">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Last Activity" name="last_activity">
//                     <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//                   </Form.Item>

//                   <Form.Item label="PIC" name="pic">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Remarks" name="remarks">
//                     <Input.TextArea rows={3} />
//                   </Form.Item>
//                 </Form>
//               </Modal>
//               <Modal
//                 title="Edit Lead"
//                 open={editLeadModalOpen}
//                 onCancel={closeEditLeadModal}
//                 onOk={handleLeadUpdate}
//                 confirmLoading={updateLeadLoading}
//                 okText="Update"
//                 destroyOnHidden
//               >
//                 <Form form={editLeadForm} layout="vertical">
//                   <Form.Item
//                     label="Name"
//                     name="name"
//                     rules={[
//                       { required: true, message: "Please enter the lead name" },
//                     ]}
//                   >
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Title" name="title">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item
//                     label="Date"
//                     name="date"
//                     rules={[
//                       { required: true, message: "Please select the date" },
//                     ]}
//                   >
//                     <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//                   </Form.Item>

//                   <Form.Item label="Division" name="division">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Client" name="client">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Email" name="email">
//                     <Input type="email" />
//                   </Form.Item>

//                   <Form.Item label="Phone" name="phone">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Lead Status" name="lead_status">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Lead Source" name="lead_source">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Last Activity" name="last_activity">
//                     <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
//                   </Form.Item>

//                   <Form.Item label="PIC" name="pic">
//                     <Input />
//                   </Form.Item>

//                   <Form.Item label="Remarks" name="remarks">
//                     <Input.TextArea rows={3} />
//                   </Form.Item>
//                 </Form>
//               </Modal>
//             </Col>
//             <Col>
//               <RangePicker
//                 value={currentRange}
//                 format="YYYY-MM-DD"
//                 allowClear={false}
//                 onChange={(value) => {
//                   if (!value || !value[0] || !value[1]) {
//                     return;
//                   }
//                   setDateRange([
//                     value[0].format("YYYY-MM-DD"),
//                     value[1].format("YYYY-MM-DD"),
//                   ]);
//                   setPage(1);
//                 }}
//               />
//             </Col>
//             <Col>
//               <Button
//                 onClick={() => downloadAsCsv(selectedStage, data.records)}
//               >
//                 Download Excel
//               </Button>
//             </Col>
//           </Row>
//         </Col>
//         <Col span={24}>
//           <Table<SalesRecord>
//             rowKey="id"
//             loading={loading}
//             columns={columns}
//             size="small"
//             dataSource={data.records}
//             scroll={{ x: 1500 }}
//             pagination={{
//               current: page,
//               pageSize,
//               total: data.total,
//               showSizeChanger: true,
//               onChange: (nextPage, nextPageSize) => {
//                 setPage(nextPage);
//                 setPageSize(nextPageSize ?? pageSize);
//               },
//             }}
//           />
//         </Col>
//       </Row>
//     </>
//   );
// }

// export default SalesManagement;
import { Col, Row } from "antd";
import Header from "./Header";
function SalesManagement() {
  return (
    <Row>
      <Col span={24}>
        <Header />
      </Col>
    </Row>
  );
}

export default SalesManagement;
