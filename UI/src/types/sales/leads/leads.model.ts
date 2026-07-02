export type LeadsModel = {
  id: number | null;
  serialNumber: number | null;
  name: string | null;
  title: string | null;
  date: string | null;
  division: string | null;
  client: string | null;
  email: string | null;
  phone: string | null;
  remark: string | null;
  leadStatus: string | null;
  leadSource: string | null;
  lastActivity: string | null;
  pic: string | null;
  requestForProposal: boolean | null;
};

export type LeadsListModel = {
  records: LeadsModel[];
};
