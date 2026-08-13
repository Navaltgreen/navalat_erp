export type SalesStage =
  | "leads"
  | "proposal"
  | "quotation_phase_1"
  | "quotation_phase_2"
  | "quotation_phase_3"
  | "purchase";

export type SalesRecord = {
  id: number;
  slNo: number | null;
  name: string;
  title: string | null;
  date: string | null;
  division: string | null;
  client: string | null;
  email: string | null;
  phone: string | null;
  remarks: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  leadStatus?: string | null;
  leadSource?: string | null;
  lastActivity?: string | null;
  pic?: string | null;
  proposalNumber?: string | null;
  picForProposal?: string | null;
  attachment?: string | null;
  lead?: number | null;
  quotationNumber?: string | null;
  quotation?: number | null;
  purchaseOrderNumber?: string | null;
  amount?: string | null;
};

export type SalesListModel = {
  records: SalesRecord[];
  total: number;
};
