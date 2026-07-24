export interface MileStone {
  id: number;
  milestone_amount: number;
  received_amount: number;
  month_year: string | null;
  stage_percent: number | null;
  due_date: string;
  status: string;
  completion_date: string | null;
  invoice_no: string | null;
  invoice_date: string | null;
  invoice_attachment: string | null;
  tds_ded: string | null;
  pending_dues: string | null;
  remarks: string;
  pic: string | null;
  is_deleted: boolean;
  created_at: string;
  created_by: number | null;
  updated_by: number | null;
  updated_at: string;
  project_amount_id: number;
}
export type MileStoneResponse = MileStone[];
