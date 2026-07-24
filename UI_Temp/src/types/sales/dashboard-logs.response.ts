export type SalesLogModule = "lead" | "proposal" | "quotation" | "purchase";

export type SalesLogItem = {
  id: number;
  work_id: number;
  work_name: string;
  previous_status: string;
  status: string;
  change_type: string;
  comments: string | null;
  team_member: string | null;
  changed_at: string;
};

export type SalesDashboardLogsApiResponse = {
  success: boolean;
  message: string;
  data: {
    logs: SalesLogItem[];
  };
  meta: Record<string, unknown>;
};
