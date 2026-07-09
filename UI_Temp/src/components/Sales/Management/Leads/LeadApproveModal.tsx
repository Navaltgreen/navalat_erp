import {
  Alert,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";

import { useRequestProposalStatus } from "../../../../query/sales/management/leads/requestforpropsal.post.query";
import { checkProposalNumber } from "../../../../services/sales/management/proposal/updateProposal.service";
import { useSalesTeamMembersStore } from "../../../../store/sales/team-members.store";
import { showNotification } from "../utils/showNotification";

export type LeadApproveSource = {
  id: number;
  name: string;
  title: string;
  priority?: string;
  division: string;
  client: string;
  email: string;
  phone: string;
  pic: string;
  leadStatus: string;
};

type LeadApproveModalProps = {
  open: boolean;
  lead: LeadApproveSource | null;
  onClose: () => void;
};

type ProposalDraft = {
  proposalNumber: string;
  picForProposal: number | null;
  priority: "Low" | "Medium" | "High" | null;
};

function createDraft(): ProposalDraft {
  return {
    proposalNumber: "",
    picForProposal: null,
    priority: null,
  };
}

function LeadApproveModal({ open, lead, onClose }: LeadApproveModalProps) {
  console.log(lead);
  const { mutate: requestProposalMutate, isPending } =
    useRequestProposalStatus();
  const teamMembers = useSalesTeamMembersStore((state) => state.data);

  const [proposalDraft, setProposalDraft] =
    useState<ProposalDraft>(createDraft());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [proposalCheckState, setProposalCheckState] = useState<
    "idle" | "checking" | "success" | "error"
  >("idle");
  const [proposalCheckMessage, setProposalCheckMessage] = useState<
    string | null
  >(null);

  const proposalCheckTimerRef = useRef<number | null>(null);
  const proposalInputRef = useRef("");
  const requestSequenceRef = useRef(0);

  const memberOptions = useMemo(
    () =>
      teamMembers.map((member) => ({
        label: member.name,
        value: member.id,
      })),
    [teamMembers],
  );

  const proposalCheckTargetId = useMemo(() => lead?.id ?? null, [lead?.id]);

  const clearProposalCheckTimer = () => {
    if (proposalCheckTimerRef.current !== null) {
      window.clearTimeout(proposalCheckTimerRef.current);
      proposalCheckTimerRef.current = null;
    }
  };

  useEffect(
    () => () => {
      clearProposalCheckTimer();
    },
    [],
  );

  const runProposalNumberCheck = async (value: string, seq: number) => {
    const normalized = value.trim();

    if (!normalized) {
      setProposalCheckState("idle");
      setProposalCheckMessage(null);
      return;
    }

    const numericValue = Number(normalized);
    if (Number.isNaN(numericValue)) {
      setProposalCheckState("error");
      setProposalCheckMessage("Proposal number must be numeric");
      return;
    }

    if (proposalCheckTargetId === null) {
      setProposalCheckState("error");
      setProposalCheckMessage("Unable to validate proposal number");
      return;
    }

    try {
      const exists = await checkProposalNumber(
        proposalCheckTargetId,
        numericValue,
      );

      if (
        requestSequenceRef.current !== seq ||
        proposalInputRef.current !== value
      ) {
        return;
      }

      if (exists) {
        setProposalCheckState("error");
        setProposalCheckMessage("Proposal number already exists");
        return;
      }

      setProposalCheckState("success");
      setProposalCheckMessage("Proposal number is available");
    } catch {
      if (
        requestSequenceRef.current !== seq ||
        proposalInputRef.current !== value
      ) {
        return;
      }

      setProposalCheckState("error");
      setProposalCheckMessage("Unable to validate proposal number");
    }
  };

  const scheduleProposalCheck = (value: string) => {
    clearProposalCheckTimer();

    if (!value.trim()) {
      setProposalCheckState("idle");
      setProposalCheckMessage(null);
      return;
    }

    setProposalCheckState("checking");
    setProposalCheckMessage("Checking proposal number...");

    requestSequenceRef.current += 1;
    const seq = requestSequenceRef.current;

    proposalCheckTimerRef.current = window.setTimeout(() => {
      proposalCheckTimerRef.current = null;
      void runProposalNumberCheck(value, seq);
    }, 800);
  };

  const handleClose = () => {
    clearProposalCheckTimer();
    proposalInputRef.current = "";
    requestSequenceRef.current += 1;
    setProposalDraft(createDraft());
    setSubmitError(null);
    setProposalCheckState("idle");
    setProposalCheckMessage(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!lead) {
      return;
    }

    if (
      !proposalDraft.proposalNumber.trim() ||
      proposalDraft.picForProposal === null ||
      proposalDraft.priority === null
    ) {
      setSubmitError(
        "Please complete proposal number, PIC and priority before submit.",
      );
      return;
    }

    if (proposalCheckState === "checking") {
      setSubmitError(
        "Please wait until proposal number validation is complete.",
      );
      return;
    }

    if (proposalCheckState !== "success") {
      setSubmitError(
        "Please enter a valid proposal number that does not already exist.",
      );
      return;
    }

    setSubmitError(null);

    requestProposalMutate(
      {
        id: lead.id,
        is_converted: true,
        lead_status: "Approved",
        name: lead.name,
        title: lead.title,
        division: lead.division,
        client: lead.client,
        email: lead.email,
        phone: lead.phone,
        priority: proposalDraft.priority,
        proposal_number: proposalDraft.proposalNumber.trim(),
        pic_for_proposal: proposalDraft.picForProposal,
      },
      {
        onSuccess: () => {
          showNotification({
            type: "success",
            message: "Proposal Submitted",
            description: `${lead.name} proposal data was submitted successfully.`,
          });
          handleClose();
        },
        onError: () => {
          setSubmitError("Unable to submit proposal. Please try again.");
        },
      },
    );
  };

  return (
    <Modal
      title="Create Proposal"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      width={700}
    >
      {lead ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Descriptions bordered size="small" column={2} title="Lead Details">
            <Descriptions.Item label="Name">{lead.name}</Descriptions.Item>
            <Descriptions.Item label="Title">{lead.title}</Descriptions.Item>
            <Descriptions.Item label="Division">
              {lead.division}
            </Descriptions.Item>
            <Descriptions.Item label="Client">{lead.client}</Descriptions.Item>
            <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{lead.phone}</Descriptions.Item>
            <Descriptions.Item label="PIC">{lead.pic || "-"}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {lead.leadStatus}
            </Descriptions.Item>
          </Descriptions>

          {submitError ? (
            <Alert type="error" showIcon message={submitError} />
          ) : null}

          <Card title="Proposal">
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              <span style={{ fontWeight: 600 }}>Proposal Number</span>
              <Input
                placeholder="Enter proposal number"
                value={proposalDraft.proposalNumber}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  proposalInputRef.current = nextValue;
                  setSubmitError(null);
                  setProposalDraft((current) => ({
                    ...current,
                    proposalNumber: nextValue,
                  }));
                  scheduleProposalCheck(nextValue);
                }}
              />
              {proposalCheckMessage ? (
                <span
                  style={{
                    fontSize: 12,
                    color:
                      proposalCheckState === "error"
                        ? "#cf1322"
                        : proposalCheckState === "success"
                          ? "#389e0d"
                          : "#595959",
                  }}
                >
                  {proposalCheckMessage}
                </span>
              ) : null}

              <span style={{ fontWeight: 600 }}>PIC for Proposal</span>
              <Select
                style={{ width: "100%" }}
                placeholder="Select PIC"
                value={proposalDraft.picForProposal ?? undefined}
                options={memberOptions}
                onChange={(value) => {
                  setSubmitError(null);
                  setProposalDraft((current) => ({
                    ...current,
                    picForProposal: value,
                  }));
                }}
              />

              <span style={{ fontWeight: 600 }}>Priority</span>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Priority"
                value={proposalDraft.priority ?? undefined}
                options={[
                  { label: "Low", value: "Low" },
                  { label: "Medium", value: "Medium" },
                  { label: "High", value: "High" },
                ]}
                onChange={(value) => {
                  setSubmitError(null);
                  setProposalDraft((current) => ({
                    ...current,
                    priority: value,
                  }));
                }}
              />
            </Space>
          </Card>

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              loading={isPending}
              disabled={proposalCheckState === "checking"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Space>
        </Space>
      ) : null}
    </Modal>
  );
}

export default LeadApproveModal;
