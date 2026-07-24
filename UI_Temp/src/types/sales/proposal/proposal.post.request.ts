export type CreateProposalRequest = {
  attachment: string;
  remarks: string;
  proposal_number: number | null;
  pic: string;
  priority?: "Low" | "Medium" | "High";
};
