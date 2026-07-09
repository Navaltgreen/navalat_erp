import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import { useEffect } from "react";

import { useRequestSalesProposalStatus } from "../../../../query/sales/management/proposal/requestforsalespropsal.post.query";
import { showNotification } from "../utils/showNotification";

export type ProposalQuotationSource = {
  id: number;
  name: string;
};

type CreateQuotationModalProps = {
  open: boolean;
  proposal: ProposalQuotationSource | null;
  onClose: () => void;
};

type CreateQuotationFormValues = {
  amount: number;
  remarks: string;
};

function CreateQuotationModal({
  open,
  proposal,
  onClose,
}: CreateQuotationModalProps) {
  const [form] = Form.useForm<CreateQuotationFormValues>();
  const { mutate: requestSalesProposalMutate, isPending } =
    useRequestSalesProposalStatus();

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
  }, [form, open, proposal?.id]);

  const handleSubmit = (values: CreateQuotationFormValues) => {
    if (!proposal) {
      return;
    }

    requestSalesProposalMutate(
      {
        id: proposal.id,
        is_converted: false,
        proposal_status: "Pending",
        amount: values.amount,
        remarks: values.remarks,
      },
      {
        onSuccess: () => {
          showNotification({
            type: "success",
            message: "Quotation Created",
            description: `${proposal.name} moved to quotation successfully.`,
          });
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      title="Create Quotation"
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

export default CreateQuotationModal;
