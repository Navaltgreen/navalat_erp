export type requestProposalBody = {
  is_converted: boolean;
  lead_status: "Approved" | "Declined" | "Pending";
};
export type requestQuotationBody = {
  phase: number;
};
