export type CreateLeadsRequest = {
  name: string;
  title: string;
  date: string;
  division: string;
  client: string;
  email: string;
  phone: string;
  remark: string;
  lead_status: string;
  lead_source: string;
  last_activity: string;
  pic: string;
};

export type UpdateLeadsRequest = CreateLeadsRequest;
