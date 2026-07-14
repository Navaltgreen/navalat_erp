export type CreateLeadRequest = {
  name: string;
  title: string;
  division: string;
  client: string;
  priority: "Low" | "Medium" | "High";
  lead_status?: string;
  lead_source: string;
  email: string;
  phone: string;
  pic: string;
  remark: string;
  last_activity: string;
};
