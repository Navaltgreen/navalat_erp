export type ProposalQuotationResponseItem = {
  id: number;
  quotation_status: string | null;
  version: number | null;
  quotation_number: number | null;
  status: string | null;
  amount: string | null;
  is_converted?: boolean | null;
  versions?: number | null;
  remarks?: string | null;
  pic?: string | null;
  converted_date?: string | null;
  attachment?: string | null;
};

export type ProposalQuotationResponse = {
  success: boolean;
  message: string;
  data: {
    quotations: ProposalQuotationResponseItem[];
  };
  meta?: Record<string, unknown>;
};
