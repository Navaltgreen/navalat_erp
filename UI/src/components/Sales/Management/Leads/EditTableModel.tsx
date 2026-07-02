import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Row,
  Col,
} from "antd";

import { useUpdateLeadMutation } from "../../../../query/sales/management/leads/update.query";
import type { DataType } from "../../../../types/sales/leads/leads.edit.request";
import { useEffect } from "react";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store";
// import { DatePicker } from "antd";

type EditTableModelProps = {
  open: boolean;
  onClose: () => void;
  editData: DataType | null;
};

const EditTableModel: React.FC<EditTableModelProps> = ({
  open,
  onClose,
  editData,
}) => {
  const { mutate: updateLeadMutate, isPending } = useUpdateLeadMutation();
 const members = useSalesTeamMembersStore((state) => state.data);
  const [form] = Form.useForm();
  useEffect(() => {
    if (editData) {
      console.log("editData", editData);
      form.setFieldsValue({
        name: editData.name,
        title: editData.title,
        division: editData.division,
        client: editData.client,
        lead_status: editData.leadStatus,
        lead_source: editData.leadSource,
        pic: editData.pic,
        email: editData.email,
        phone: editData.phone,
        remark: editData.remark, // important mapping
      });
    }
  }, [editData, form]);
  return (
    <>
      <Modal
        title="Edit Lead"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          //    onFinish={(values) => console.log(values)}
          disabled={isPending}
          onFinish={(values) => {
            if (!editData?.id) return;

            updateLeadMutate(
              {
                id: editData.id,
                payload: values,
              },
              {
                onSuccess: () => {
                  form.resetFields();
                  onClose();
                },
              },
            );
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter title" }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Division"
                name="division"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter division" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Client"
                name="client"
                rules={[{ required: true }]}
              >
                <Input placeholder="Client Details" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Lead Source"
                name="lead_source"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select source"
                  options={[
                    { label: "Website", value: "Website" },
                    { label: "LinkedIn", value: "LinkedIn" },
                    { label: "Referral", value: "Referral" },
                    { label: "Email Campaign", value: "Email Campaign" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="PIC" name="pic" rules={[{ required: true }]}>
                <Select
                  placeholder="Select PIC"
                  options={members.map((member) => ({
                    label: member.name,
                    value: String(member.id),
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder="Enter phone"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {/* <Col span={12}>
              <Form.Item
                label="Lead Activity"
                name="updated_at"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col> */}

            {/* <Col span={12}>
              <Form.Item
                label="Lead Status"
                name="lead_status"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select status"
                  options={[
                    { label: "New", value: "New" },
                    { label: "Qualified", value: "Qualified" },
                    { label: "Contacted", value: "Contacted" },
                    { label: "Proposal Sent", value: "Proposal Sent" },
                  ]}
                />
              </Form.Item>
            </Col> */}
          </Row>

          <Form.Item label="Remarks" name="remark">
            <Input.TextArea rows={4} placeholder="Enter remarks" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTableModel;
