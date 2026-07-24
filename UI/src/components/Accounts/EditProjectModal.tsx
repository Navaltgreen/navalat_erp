import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useAccountsEditMileStones } from "../../query/accounts/milestones.edit.query";

interface Props {
  open: boolean;
  project: {
    milestoneId: number;
    projectId: number;
    received_amount: number;
  } | null;
  onClose: () => void;
}

const EditProjectModal = ({ open, project, onClose }: Props) => {
  const { mutate: requestEditMileStoneMutate } = useAccountsEditMileStones();
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        amount: project.received_amount,
      });
    }
  }, [project, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!project) return;
    requestEditMileStoneMutate(
      {
        milestoneId: project.milestoneId,
        project_id: project.projectId,
        received_amount: Number(values.received_amount),
        remarks: values.remarks,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal open={open} title="Edit Project" onOk={handleOk} onCancel={onClose}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Received Amount"
          name="received_amount"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}
        <Form.Item label="Remarks" name="remarks" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
