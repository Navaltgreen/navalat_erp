import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import { FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { showNotification } from "../Sales/Management/utils/showNotification";
import useAccountsHeaderStore from "../../store/accounts/header.store";
import { useInvoiceUpdateMileStones } from "../../query/accounts/invoice.update.query";
import { useUploadDocumentMutation } from "../../query/sales/management/proposal/uploadfile.query";

import { useSalesTeamMembersQuery } from "../../query/sales/team-members.query";
import { useAccountsEditMileStones } from "../../query/accounts/milestones.edit.query";

const { Dragger } = Upload;

type InvoiceDetailsProps = {
  open: boolean;
  project: {
    milestone_amount: number;
    milestoneId: number;
    projectId: number;
  } | null;
  onClose: () => void;
};

const InvoiceDetails = ({ open, project, onClose }: InvoiceDetailsProps) => {
  const { mutate: requestEditMileStoneMutate } = useInvoiceUpdateMileStones();
  const { mutate: requestStatusUpdateMutate } = useAccountsEditMileStones();
  const { data: members } = useSalesTeamMembersQuery(200);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  const { mutateAsync: uploadDocument, isPending: isUploading } =
    useUploadDocumentMutation();
  const [form] = Form.useForm();

  const handleCustomUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadDocument(file as File);

      if (!url) {
        throw new Error("No file URL returned");
      }

      setAttachmentUrl(url);
      onSuccess?.(url);

      showNotification({
        type: "success",
        message: "File uploaded",
        description: "Attachment uploaded successfully.",
      });

      // clear any earlier validation error on the field once we have a url
      form.validateFields(["invoice_attachment"]).catch(() => {});
    } catch (err) {
      setAttachmentUrl("");
      onError?.(err as Error);
      showNotification({
        type: "error",
        message: "Upload failed",
        description: "Could not upload the attachment. Please try again.",
      });
    }
  };
  const handleOk = async () => {
    const values = await form.validateFields();
    if (!project) return;
    // if (!attachmentUrl) {
    //   showNotification({
    //     type: "error",
    //     message: "Attachment required",
    //     description: "Please upload a valid attachment before submitting.",
    //   });
    //   return;
    // }

    requestEditMileStoneMutate(
      {
        milestoneId: project.milestoneId,
        project_id: project.projectId,

        invoice_no: values.invoice_no,

        invoice_date: values.invoice_date
          ? values.invoice_date.toISOString()
          : "",

        invoice_to: values.invoice_to,

        invoice_by: values.invoice_by,

        invoice_attachment: attachmentUrl,
      },
      {
        onSuccess: () => {
          showNotification({
            type: "success",
            message: "Details updated",
            description: `Details updated sucessfully.`,
          });
          // Invoice posted successfully — now update the milestone status
          requestStatusUpdateMutate(
            {
              milestoneId: project.milestoneId,
              project_id: project.projectId,
              status: "Invoice generated",
            },
            {
              onSuccess: () => {
                showNotification({
                  type: "success",
                  message: "Milestone Updated",
                  description: `Milestone status changed to "Invoice generated".`,
                });
              },
              onError: () => {
                showNotification({
                  type: "error",
                  message: "Failed to update milestone",
                  description: `Couldn't change milestone status to "Invoice generated".`,
                });
              },
            },
          );
          form.resetFields();
          setFileList([]);
          setAttachmentUrl("");
          onClose();
        },
        onError: () => {
          showNotification({
            type: "error",
            message: "Failed to update Details",
            description: `Details couldn't updated.`,
          });
          onClose();
        },
      },
    );
  };
  const { projects, selectedProjectId, setSelectedProjectId } =
    useAccountsHeaderStore();
  useEffect(() => {
    if (project && open) {
      form.resetFields();

      form.setFieldsValue({
        invoice_to: project.projectId,
      });
    }
  }, [project, open, form]);
  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <FileTextOutlined />
          <span>Invoice details</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={570}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,

        <Button key="submit" type="primary" onClick={handleOk}>
          Generate Invoice
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Divider />

        {/* Invoice Number + Date */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Form.Item
            label="Invoice Number"
            name="invoice_no"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Please enter invoice number",
              },
            ]}
          >
            <Input placeholder="INV-2026-014" />
          </Form.Item>

          <Form.Item
            label="Invoice Date"
            name="invoice_date"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Please select invoice date",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </div>

        {/* Invoice To + Invoice By */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <Form.Item
            label="Invoice To"
            name="invoice_to"
            style={{ flex: 1 }}
            rules={[
              {
                required: true,
                message: "Please select client",
              },
            ]}
          >
            <Select
              placeholder="Select Client"
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map((project) => ({
                label: project.name,
                value: project.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Invoice By"
            name="invoice_by"
            style={{ flex: 1 }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Please select staff",
            //   },
            // ]}
          >
            <Select
              placeholder="Select Issuer"
              options={members.map((member) => ({
                label: member.name,
                value: member.id,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Invoice Attachment"
          name="invoice_attachment"
          rules={[
            {
              validator: async () => {
                if (isUploading) {
                  return Promise.reject(
                    new Error("Please wait for the upload to finish"),
                  );
                }
                //       if (!attachmentUrl) {
                //         return Promise.reject(
                //           new Error("Please upload an attachment"),
                //         );
                //       }
                //       return Promise.resolve();
              },
            },
          ]}
        >
          <Dragger
            fileList={fileList}
            customRequest={handleCustomUpload}
            maxCount={1}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={({ fileList: newList }) => {
              setFileList(newList.slice(-1));
            }}
            onRemove={() => {
              setFileList([]);
              setAttachmentUrl("");
            }}
            style={{ padding: "12px 0" }}
          >
            <p style={{ margin: 0, fontSize: 12 }}>
              <InboxOutlined style={{ marginRight: 6 }} />
              Drag file or click to upload
            </p>

            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#8C8C88" }}>
              PDF, JPG, JPEG or PNG
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceDetails;
