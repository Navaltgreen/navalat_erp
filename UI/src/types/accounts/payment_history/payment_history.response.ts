export interface PaymentHistoryItem {
  project_name: string;
  client_name: string;
  milestone_due_date: string;
  invoice_no: string;
  invoice_date: string;
  received_date: string;
  amount: number;
  payment_type: string;
}

export interface PaymentHistoryData {
  project_id: string;
  total_received_amount: number;
  payments: PaymentHistoryItem[];
}

export interface PaymentAllHistoryResponse {
  data: PaymentHistoryData;
  message: string;
}
