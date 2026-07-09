export type requestProposalBody = {
  is_converted: boolean;
  lead_status: "Approved" | "Declined" | "Pending";
  priority?: "Low" | "Medium" | "High";
  name?: string;
  title?: string;
  division?: string;
  client?: string;
  email?: string;
  phone?: string;
  proposal_number?: string;
  pic_for_proposal?: number;
};
export type requestQuotationBody = {
  phase: number;
};
