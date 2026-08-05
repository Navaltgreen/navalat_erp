export type CreateProposalRequest = {
  attachment: string;
  remarks: string;
  proposal_number: number | null;
  // pic: string;
  pic: number;
  priority?: "Low" | "Medium" | "High";
};
