export type LeadHistoryItem = {
  phase: string;
  id: number;
  name: string | null;
  status: string | null;
  createdAt: string | null;
  convertedDate: string | null;
  proposalNumber: string | null;
  quotationNumber: string | null;
  purchaseOrderNumber: string | null;
  version: number | null;
  amount: number | null;
};
