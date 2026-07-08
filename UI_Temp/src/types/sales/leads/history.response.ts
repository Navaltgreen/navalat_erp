export type LeadHistoryResponseItem = {
  phase: string;
  id: number;
  name?: string | null;
  status?: string | null;
  created_at: string | null;
  converted_date?: string | null;
  proposal_number?: string | null;
  quotation_number?: string | null;
  purchase_order_number?: string | null;
  version?: number | null;
  amount?: number | null;
};

export type LeadHistoryEnvelope = {
  success: boolean;
  message: string;
  data: {
    history: LeadHistoryResponseItem[];
  } | null;
  meta: Record<string, unknown>;
};
