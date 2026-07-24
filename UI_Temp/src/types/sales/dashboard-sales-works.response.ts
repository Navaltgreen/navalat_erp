export type SalesWorkTeam = {
  label: string;
  value: string;
};

export type SalesWorkItem = {
  id: number;
  project_id: number;
  category: string;
  subcategory: string;
  tab: string;
  status: string;
  description: string;
  comments: string | null;
  images: string[];
  team: SalesWorkTeam[];
};

export type SalesDashboardWorksApiResponse = {
  success: boolean;
  message: string;
  data: {
    works: SalesWorkItem[];
  };
  meta: Record<string, unknown>;
};
