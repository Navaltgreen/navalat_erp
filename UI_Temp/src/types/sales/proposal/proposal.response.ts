export type ProposalResponseItem = {
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
  is_deleted?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_converted?: boolean | null;
  proposal_number?: number | null;
  pic_for_proposal?: string | null;
  attachment?: string | null;
  lead?: string | null;
  proposal_status?: "Pending" | "Approved" | "Declined";
};

export type ProposalResponse = {
  success: boolean;
  message: string;
  data: {
    table_data: ProposalResponseItem[];
  };
};
