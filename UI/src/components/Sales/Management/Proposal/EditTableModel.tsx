import {
  Button,
  InputNumber,
  Modal,
  Form,
  Input,
  Space,
  Upload,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { checkProposalNumber } from "../../../../services/sales/management/proposal/updateProposal.service";
import { useUpdateProposalMutation } from "../../../../query/sales/management/proposal/update.query";
import { useUploadDocumentMutation } from "../../../../query/sales/management/proposal/uploadfile.query.ts";
import type { proposalDataType } from "../../../../types/sales/leads/leads.edit.request";
import { useEffect, useRef, useState } from "react";
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
  const proposalNumberCheckTimerRef = useRef<number | null>(null);
  const [isCheckingProposalNumber, setIsCheckingProposalNumber] =
    useState(false);
  const [proposalNumberError, setProposalNumberError] = useState<string | null>(
    null,
  );

  const resetProposalNumberCheck = () => {
    if (proposalNumberCheckTimerRef.current !== null) {
      window.clearTimeout(proposalNumberCheckTimerRef.current);
      proposalNumberCheckTimerRef.current = null;
    }

    setIsCheckingProposalNumber(false);
    setProposalNumberError(null);
  };

  const scheduleProposalNumberCheck = (proposalNumber: number | null) => {
    if (proposalNumberCheckTimerRef.current !== null) {
      window.clearTimeout(proposalNumberCheckTimerRef.current);
      proposalNumberCheckTimerRef.current = null;
    }

    if (
      proposalNumber === null ||
      Number.isNaN(proposalNumber) ||
      proposalNumber < 1 ||
      proposalNumber === (editData?.proposal_no ?? null) ||
      !editData?.id
    ) {
      setIsCheckingProposalNumber(false);
      setProposalNumberError(null);
      void form.validateFields(["proposal_number"]).catch(() => undefined);
      return;
    }

    setIsCheckingProposalNumber(true);
    setProposalNumberError(null);

    proposalNumberCheckTimerRef.current = window.setTimeout(async () => {
      try {
        const exists = await checkProposalNumber(editData.id, proposalNumber);

        setProposalNumberError(
          exists ? "Proposal number already exists" : null,
        );
      } catch {
        setProposalNumberError("Unable to validate proposal number");
      } finally {
        setIsCheckingProposalNumber(false);
        proposalNumberCheckTimerRef.current = null;
        void form.validateFields(["proposal_number"]).catch(() => undefined);
      }
    }, 2000);
  };

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        remarks: editData.remark ?? "",
        proposal_number: editData.proposal_no ?? undefined,
        pic: editData.pic ?? undefined,
        priority: editData.priority ?? undefined,
      });

      const resetTimerId = window.setTimeout(() => {
        resetProposalNumberCheck();
      }, 0);

      return () => {
        window.clearTimeout(resetTimerId);
      };
    }
  }, [editData, form]);

  useEffect(() => {
    return () => {
      if (proposalNumberCheckTimerRef.current !== null) {
        window.clearTimeout(proposalNumberCheckTimerRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    resetProposalNumberCheck();
    onClose();
  };

  return (
    <>
      <Modal
        title="Edit Proposal"
        open={open}
        onCancel={handleClose}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          //    onFinish={(values) => console.log(values)}
          disabled={isPending}
          onValuesChange={(changedValues) => {
            if (
              Object.prototype.hasOwnProperty.call(
                changedValues,
                "proposal_number",
              )
            ) {
              const rawValue = changedValues.proposal_number;
              const proposalNumber =
                rawValue === undefined || rawValue === null || rawValue === ""
                  ? null
                  : Number(rawValue);

              scheduleProposalNumberCheck(proposalNumber);
            }
          }}
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
                  proposal_number: values.proposal_number ?? null,
                  // pic: values.pic,
                  pic: editData.id,
                  priority: values.priority,
                },
              },
              {
                onSuccess: () => {
                  resetProposalNumberCheck();
                  form.resetFields();
                  onClose();
                },
              },
            );
          }}
        >
          <Form.Item
            label="Proposal Number"
            name="proposal_number"
            validateTrigger={["onBlur", "onSubmit"]}
            hasFeedback
            validateStatus={
              proposalNumberError
                ? "error"
                : isCheckingProposalNumber
                  ? "validating"
                  : undefined
            }
            help={
              proposalNumberError ??
              (isCheckingProposalNumber
                ? "Checking proposal number..."
                : undefined)
            }
            rules={[
              { required: true, message: "Please enter proposal number" },
              {
                validator: async (_, value) => {
                  if (value === undefined || value === null || value === "") {
                    return;
                  }

                  if (proposalNumberError) {
                    throw new Error(proposalNumberError);
                  }
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Enter proposal number"
              style={{ width: "100%" }}
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
          <Form.Item label="PIC" name="pic" rules={[{ required: true }]}>
            <Select
              placeholder="Select PIC"
              options={members.map((member) => ({
                label: member.name,
                value: String(member.id),
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select
              placeholder="Select priority"
              options={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <Input.TextArea rows={4} placeholder="Enter remarks" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  isCheckingProposalNumber || Boolean(proposalNumberError)
                }
              >
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
