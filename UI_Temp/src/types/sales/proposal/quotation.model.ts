export type ProposalQuotationModel = {
  id: number;
  quotationStatus: string;
  version: number;
  quotationNumber: number | null;
  status: string;
  amount: string;
  isConverted: boolean;
  versions: number;
  remarks: string;
  pic: string;
  convertedDate: string;
  attachment: string;
};

export type ProposalQuotationListModel = {
  records: ProposalQuotationModel[];
};
