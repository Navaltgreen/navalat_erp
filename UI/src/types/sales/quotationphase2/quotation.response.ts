export type QuotationResponseItem = {
  id: number;
  sl_no?: number | null;
  name?: string | null;
  title?: string | null;
  date?: string | null;
  division?: string | null;
  client?: string | null;
  email?: string | null;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  version: number | null;
  quotation_number: number | null;
  status: string | null;
  amount: string | null;
  is_converted?: boolean | null;

  remarks?: string | null;
  proposal: number | null;
  pic?: string | null;
  attachment: string | null;
};

export type QuotationResponse = {
  success: boolean;
  message: string;
  data: {
    quotations: QuotationResponseItem[];
  };
};
