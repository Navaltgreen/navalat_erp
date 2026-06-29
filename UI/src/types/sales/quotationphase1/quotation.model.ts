export type QuotationModel = {
  id: number;
  serialNumber: number;
  name: string;
  title: string;
  date: string;
  division: string;
  client: string;
  email: string;
  phone: string;
  remark: string;
  status: string;
  amount: string;
  sales_quotation_number: number;
  // proposal_no: number;
  // leadStatus: string;
  // leadSource: string;
  // lastActivity: string | null;
  attachments: string;
  pic: string;
  request_for_sales_quotation: boolean;
  version: number;
};

export type QuotationListModel = {
  records: QuotationModel[];
};
