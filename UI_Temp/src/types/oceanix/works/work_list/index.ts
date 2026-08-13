export interface WorkListResponse {
  data: {
    works: WorkListData[];
  };
}

export interface WorkListData {
  id: number;
  project_id: number;
  project_name: string;

  category: string;
  subcategory: string;
  tab: string;

  status: string;
  images: string[];

  description: string;
  comments: string;

  team_id: Team[];

  created_at: string;
  created_by: number | null;

  updated_at: string;
  updated_by: number | null;
  assigned_to?:{
    id?:number
    value?:string
  };
}

export interface Team {
  label: string;
  value: string;
}

export type TeamMember = {
  id: number;
  name: string;
};

export type TeamMembersResponse = {
  data: {
    teams: TeamMember[];
  };
};

export interface AssignWorkPayload {
  data: AssignWorkItem[];
}

export interface AssignWorkItem {
  work_id: number;
  project_id: number;

  project_name?: string;

  category?: string;
  subcategory?: string;
  tab?: string;

  status?: string;

  description?: string;
  comments?: string;
  created_at: string;
  created_by: number | null;

  updated_at: string;
  updated_by: number | null;

  assigned_to: {
    id: number;
    name: string;
  };
}