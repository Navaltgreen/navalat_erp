import { Button, Modal, Form, Input, Space, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateProposalMutation } from "../../../../query/sales/management/quotationphase1/update.query.ts";
import { useUploadDocumentMutation } from "../../../../query/sales/management/proposal/uploadfile.query.ts";
import type { proposalDataType } from "../../../../types/sales/leads/leads.edit.request";
import { useEffect } from "react";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store.ts";

type EditTableModelProps = {
  open: boolean;
  onClose: () => void;
  editData: proposalDataType | null;
};

const EditTableModel: React.FC<EditTableModelProps> = ({
  open,
  onClose,
  editData,
}) => {
  const { mutate: updateProposalMutate, isPending } =
    useUpdateProposalMutation();
  const { mutateAsync: uploadDocument } = useUploadDocumentMutation();
  const members = useSalesTeamMembersStore((state) => state.data);
  const [form] = Form.useForm();
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        remark: editData.remark ?? "", // important mapping
      });
    }
  }, [editData, form]);
  return (
    <>
      <Modal
        title="Edit Quotation Phase 1"
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
          onFinish={async (values) => {
            if (!editData?.id) return;
            let fileUrl = "";
            if (values.attachment?.fileList?.length) {
              const file = values.attachment.fileList[0].originFileObj;

              fileUrl = await uploadDocument(file);
            }

            updateProposalMutate(
              {
                id: editData.id,
                payload: {
                  attachment: fileUrl,
                  remarks: values.remarks,
                  proposal_number: editData.proposal_no ?? 0,
                  pic: values.pic,
                },
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
          <Form.Item label="Upload Document" name="attachment">
            <Upload
              beforeUpload={() => false} // prevent auto upload
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="PIC" name="pic" rules={[{ required: true }]}>
            <Select
              placeholder="Select PIC"
              options={members.map((member) => ({
                label: member.name,
                value: String(member.id),
              }))}
            />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
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
