export type SalesDashboardLeadCardResponse = {
  total: number;
  pending: number;
  converted: number;
  declined: number;
};

export type SalesDashboardProposalCardResponse = {
  total: number;
  pending: number;
  submitted: number;
  approved: number;
};

export type SalesDashboardQuotationCardResponse = {
  count: number;
  total_amount: number;
  pending: number;
  approved: number;
  declined: number;
};

export type SalesDashboardPurchaseOrderCardResponse = {
  orders: number;
  total_amount: number;
  average_order: number;
};

export type SalesDashboardQuarterSummaryResponse = {
  quarter: string;
  orders: number;
  amount: number;
};

export type SalesDashboardPicPerformanceResponse = {
  pic: string;
  leads: number;
  proposals: number;
  quotation_amount: number;
  purchase_order_amount: number;
};

export type SalesDashboardQuarterPicPerformanceResponse = {
  quarter: string;
  pic: string;
  orders: number;
  amount: number;
};

export type SalesDashboardSummaryData = {
  cards: {
    lead: SalesDashboardLeadCardResponse;
    proposal: SalesDashboardProposalCardResponse;
    quotation: SalesDashboardQuotationCardResponse;
    purchase_order: SalesDashboardPurchaseOrderCardResponse;
  };
  quarter_summary: SalesDashboardQuarterSummaryResponse[];
  pic_performance: SalesDashboardPicPerformanceResponse[];
  quarter_pic_performance: SalesDashboardQuarterPicPerformanceResponse[];
};

export type SalesDashboardSummaryApiResponse = {
  success: boolean;
  message: string;
  data: SalesDashboardSummaryData;
  meta: Record<string, unknown>;
};

export const emptySalesDashboardSummaryData: SalesDashboardSummaryData = {
  cards: {
    lead: {
      total: 0,
      pending: 0,
      converted: 0,
      declined: 0,
    },
    proposal: {
      total: 0,
      pending: 0,
      submitted: 0,
      approved: 0,
    },
    quotation: {
      count: 0,
      total_amount: 0,
      pending: 0,
      approved: 0,
      declined: 0,
    },
    purchase_order: {
      orders: 0,
      total_amount: 0,
      average_order: 0,
    },
  },
  quarter_summary: [],
  pic_performance: [],
  quarter_pic_performance: [],
};
