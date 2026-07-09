export type LeadsResponseItem = {
  id: number;
  sl_no: number | null;
  name: string | null;
  title: string | null;
  priority: string | null;
  date: string | null;
  division: string | null;
  client: string | null;
  email: string | null;
  phone: string | null;
  remarks: string | null;
  is_deleted: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  lead_status: string | null;
  lead_source: string | null;
  last_activity: string | null;
  pic: string | null;
  is_converted: boolean | null;
};

export type LeadsResponse = {
  success: boolean;
  message: string;
  data: {
    table_data: LeadsResponseItem[];
  };
};
