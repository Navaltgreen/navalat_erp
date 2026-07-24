export type ProposalModel = {
  id: number;
  serialNumber: number;
  name: string;
  title: string;
  priority: string;
  date: string;
  division: string;
  client: string;
  email: string;
  phone: string;
  remark: string;
  proposal_no: number | null;
  // leadStatus: string;
  // leadSource: string;
  // lastActivity: string | null;
  attachments: string;
  pic: string;
  request_for_sales_quotation: boolean;
  proposal_status: string;
};

export type ProposalListModel = {
  records: ProposalModel[];
};
