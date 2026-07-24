export type SalesRecordResponse = {
  id: number;
  sl_no?: number | null;
  name?: string | null;
  title?: string | null;
  date?: string | null;
  division?: string | null;
  client?: string | null;
  email?: string | null;
  phone?: string | null;
  remarks?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  lead_status?: string | null;
  lead_source?: string | null;
  last_activity?: string | null;
  pic?: string | null;
  proposal_number?: string | null;
  pic_for_proposal?: string | null;
  attachment?: string | null;
  lead?: number | null;
  quotation_number?: string | null;
  quotation?: number | null;
  purchase_order_number?: string | null;
  amount?: string | null;
};

export type SalesManagementDataResponse = {
  leads?: SalesRecordResponse[];
  proposals?: SalesRecordResponse[];
  quotation_phase_1?: SalesRecordResponse[];
  quotation_phase_2?: SalesRecordResponse[];
  quotation_phase_3?: SalesRecordResponse[];
  purchase_orders?: SalesRecordResponse[];
  results?: SalesRecordResponse[];
  count?: number;
};

export type SalesManagementResponse = {
  success: boolean;
  message: string;
  data: SalesManagementDataResponse | null;
  meta?: {
    total?: number;
    page?: number;
    page_size?: number;
  };
};
