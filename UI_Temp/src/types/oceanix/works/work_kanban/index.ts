export type Priority = "critical" | "high" | "medium" | "low";
export type WorkStatus = "not-started" | "inprogress" | "fixed";

export interface KanbanWork {
  id: number;
  project_id: number;
  project_name: string;
  category: string;
  subcategory: string;
  tab: string;
  status: WorkStatus;
  priority: Priority;
  description: string;
  comments: string;
  images: string[];
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
  assigned_to: {
    id: number;
    name: string;
  };
}

export interface KanbanWorkListResponse {
  data: {
    works: KanbanWork[];
  };
}
