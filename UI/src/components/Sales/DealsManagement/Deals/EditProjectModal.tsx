import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useSalesEditDeals } from "../../../../query/sales/deals/deals.edit.query";

interface Props {
  open: boolean;
  project: {
    id: number;
    name: string;
  } | null;
  onClose: () => void;
}

const EditProjectModal = ({ open, project, onClose }: Props) => {
  const { mutate: requestSalesEditDealsMutate } = useSalesEditDeals();
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
      });
    }
  }, [project, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    requestSalesEditDealsMutate(
      {
        projectId: project!.id,
        name: values.name,
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
          label="Project Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
