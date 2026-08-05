import { Form, Input, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAccountsEditMileStones } from "../../query/accounts/milestones.post.query";
import { showNotification } from "../Sales/Management/utils/showNotification";

interface Props {
  open: boolean;
  project: {
    milestone_amount: number;
    milestoneId: number;
    projectId: number;
    total_received_amount: number;
  } | null;
  onClose: () => void;
}

const EditProjectModal = ({ open, project, onClose }: Props) => {
  const { mutate: requestEditMileStoneMutate } = useAccountsEditMileStones();
  const [form] = Form.useForm();
  console.log("pppp", project);
  const remainingBalance = project
    ? project?.milestone_amount - project?.total_received_amount
    : 0;
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const overBy = paymentAmount - remainingBalance;
  const isOverpaying = paymentAmount > 0 && overBy > 0;

  useEffect(() => {
    if (project && open) {
      form.resetFields();
      setPaymentAmount(0);
    }
  }, [project, open, form]);

  const runningTotal = useMemo(() => {
    if (!project) return 0;
    return (
      project.total_received_amount +
      (Number.isFinite(paymentAmount) ? paymentAmount : 0)
    );
  }, [project, paymentAmount]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!project) return;
    requestEditMileStoneMutate(
      {
        milestoneId: project.milestoneId,
        project_id: project.projectId,
        received_amount: Number(values.received_amount),
        remarks: values.remarks,
        payment_type: "credit",
      },
      {
        onSuccess: () => {
          showNotification({
            type: "success",
            message: "Details updated",
            description: `Details updated sucessfully.`,
          });
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

  return (
    <Modal open={open} title="Log a payment" onOk={handleOk} onCancel={onClose}>
      {project && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              flex: 1,
              background: "#F5F5F4",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div style={{ fontSize: 11, color: "#8C8C88" }}>
              Milestone amount
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              ₹{project?.milestone_amount?.toLocaleString("en-IN")}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: "#F5F5F4",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          >
            <div style={{ fontSize: 11, color: "#8C8C88" }}>
              Remaining balance
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              ₹{remainingBalance?.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}
      <Form form={form} layout="vertical">
        <Form.Item
          label="New payment amount"
          name="received_amount"
          rules={[
            { required: true, message: "Enter the payment amount" },
            {
              validator: (_, value) => {
                const num = Number(value);
                if (Number.isNaN(num) || num <= 0) {
                  return Promise.reject(new Error("Enter a valid amount"));
                }
                if (num > remainingBalance) {
                  return Promise.reject(
                    new Error(
                      `This exceeds the remaining balance by ₹${(
                        num - remainingBalance
                      ).toLocaleString(
                        "en-IN",
                      )}. Only ₹${remainingBalance.toLocaleString("en-IN")} is left on this milestone.`,
                    ),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          validateTrigger="onChange"
        >
          <Input
            placeholder="e.g. 5,000"
            status={isOverpaying ? "error" : undefined}
            onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
          />
        </Form.Item>

        {paymentAmount > 0 && !isOverpaying && project && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              padding: "8px 10px",
              background: "#EAF3DE",
              borderRadius: 8,
              color: "#173404",
              marginBottom: 16,
            }}
          >
            <span>Running total after this payment</span>
            <span style={{ fontWeight: 500 }}>
              ₹{runningTotal.toLocaleString("en-IN")}
            </span>
          </div>
        )}
        <Form.Item
          label="Remarks"
          name="remarks"
          rules={[{ required: true, message: "Add a remark" }]}
        >
          <Input placeholder="e.g. Second installment" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
