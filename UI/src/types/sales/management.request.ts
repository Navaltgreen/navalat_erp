export type SalesLeadCreateRequest = {
  name: string;
  title?: string | null;
  date: string;
  division?: string | null;
  client?: string | null;
  email?: string | null;
  phone?: string | null;
  remarks?: string | null;
  lead_status?: string | null;
  lead_source?: string | null;
  last_activity?: string | null;
  pic?: string | null;
};

export type SalesLeadUpdateRequest = {
  name: string;
  title?: string | null;
  date: string;
  division?: string | null;
  client?: string | null;
  email?: string | null;
  phone?: string | null;
  remarks?: string | null;
  lead_status?: string | null;
  lead_source?: string | null;
  last_activity?: string | null;
  pic?: string | null;
};
