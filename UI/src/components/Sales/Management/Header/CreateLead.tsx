import React, { useState } from "react";
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
import { DatePicker } from "antd";

import { useCreateLeadMutation } from "../../../../query/sales/management/leads/post.query";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store";
import { showNotification } from "../utils/showNotification";

const CreateLead: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate, isPending } = useCreateLeadMutation();
  const members = useSalesTeamMembersStore((state) => state.data);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Lead
      </Button>
      <Modal
        title="Create New Lead"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => null}
      >
        <Form
          form={form}
          layout="vertical"
          // onFinish={(values) => console.log(values)}
          disabled={isPending}
          onFinish={(values) => {
            const { lead_status, ...restValues } = values;
            const payload = {
              ...restValues,
              last_activity: values.last_activity
                ? values.last_activity.format("YYYY-MM-DD")
                : null,
            };

            void lead_status;

            mutate(payload, {
              onSuccess: () => {
                form.resetFields();
                setIsModalOpen(false);
                showNotification({
                  type: "success",
                  message: "Lead Created",
                  description: `${values?.name} lead created successfully.`,
                });
              },
            });
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
                label="Lead Activity"
                name="last_activity"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
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

          <Form.Item label="Remarks" name="remarks">
            <Input.TextArea rows={4} placeholder="Enter remarks" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Create Lead
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateLead;
