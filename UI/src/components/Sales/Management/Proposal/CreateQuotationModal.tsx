import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Upload,
  type UploadFile,
} from "antd";
import { useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useRequestSalesProposalStatus } from "../../../../query/sales/management/proposal/requestforsalespropsal.post.query";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store";
import { showNotification } from "../utils/showNotification";
import { useUploadDocumentMutation } from "../../../../query/sales/management/proposal/uploadfile.query";

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
  pic: string;
  attachment?: { fileList?: UploadFile[] };
};

function CreateQuotationModal({
  open,
  proposal,
  onClose,
}: CreateQuotationModalProps) {
  // const [form] = Form.useForm<CreateQuotationFormValues>();
  const [form] = Form.useForm();
  const { mutate: requestSalesProposalMutate, isPending } =
    useRequestSalesProposalStatus();
  const { mutateAsync: uploadDocument } = useUploadDocumentMutation();
  const members = useSalesTeamMembersStore((state) => state.data);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
  }, [form, open, proposal?.id]);

  const handleSubmit = async (values: CreateQuotationFormValues) => {
    if (!proposal) {
      return;
    }
    let fileUrl = "";

    if (values.attachment?.fileList?.length) {
      const file = values.attachment.fileList[0].originFileObj;

      // fileUrl = await uploadDocument(file);
        if (file) {
          fileUrl = (await uploadDocument(file as File)) ?? "";
        }
    }

    requestSalesProposalMutate(
      {
        id: proposal.id,
        is_converted: false,
        proposal_status: "Pending",
        amount: values.amount,
        remarks: values.remarks,
        pic: values.pic,
        attachment: fileUrl,
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
        <Form.Item label="Upload Document" name="attachment">
          <Upload
            beforeUpload={() => false} // prevent auto upload
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
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
          rules={[{ required: true, message: "Please select PIC" }]}
        >
          <Select
            placeholder="Select PIC"
            options={members.map((member) => ({
              label: member.name,
              value: String(member.id),
            }))}
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

export default CreateQuotationModal;
