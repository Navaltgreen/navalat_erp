import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  // Select,
  Space,
} from "antd";
import { useEffect, useMemo } from "react";

import { useRequestSalesMilestoneStatus } from "../../../../query/sales/deals/requestforsalesmilestone.post.query";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store";

export type ProposalQuotationSource = {
  id: number;
  name: string;
};

type CreateQuotationModalProps = {
  open: boolean;
  projectId: number;
  // proposal: ProposalQuotationSource | null;
  onClose: () => void;
};

type CreateQuotationFormValues = {
  amount: number;
  remarks: string;
  startDate: string;
  endDate: string;
  project_id: number;
  pic: number;
};

function MileStoneModal({
  open,
  projectId,
  onClose,
}: CreateQuotationModalProps) {
  const [form] = Form.useForm<CreateQuotationFormValues>();
  const { mutate: requestSalesMileStoneMutate, isPending } =
    useRequestSalesMilestoneStatus();
  const teamMembers = useSalesTeamMembersStore((state) => state.data);
  const memberOptions = useMemo(
    () =>
      teamMembers.map((member) => ({
        label: member.name,
        value: member.id,
      })),
    [teamMembers],
  );
  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
  }, [form, open]);

  const handleSubmit = (values: CreateQuotationFormValues) => {
    // if (!proposal) {
    //   return;
    // }

    requestSalesMileStoneMutate(
      {
        start_date: values.startDate,
        end_date: values.endDate,
        amount: values.amount,
        remarks: values.remarks,
        project_id: projectId,
        pic: values.pic,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      title="Create Milestone"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isPending}
      >
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select start date"
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder="Select end date" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber
            min={0}
            precision={2}
            style={{ width: "100%" }}
            placeholder="Enter amount"
          />
        </Form.Item>

        <Form.Item
          label="Remark"
          name="remarks"
          rules={[{ required: true, message: "Please enter remark" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter remark" />
        </Form.Item>

        <Form.Item
          label="PIC"
          name="pic"
          rules={[{ required: true, message: "Please enter Pic" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select PIC"
            options={memberOptions}
            onChange={(value, option) => {
              console.log(value);
              console.log(option);
              form.setFieldValue("pic", value);
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MileStoneModal;
