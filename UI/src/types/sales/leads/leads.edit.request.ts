export type DataType = {
  id: number;
  serialNumber: number;
  name: string;
  title: string;
  date: string;
  division: string;
  client: string;
  leadStatus: string;
  leadSource: string;
  lastActivity: string;
  email: string;
  phone: string;
  pic: string;
  remark: string;
  requestForProposal: boolean;
};
export type proposalDataType = {
  id: number;
  remark: string;
  proposal_no?: number;
};
