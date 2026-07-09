export interface teamPayload {
  project_id: number;
  role_id: number;
}

export interface WorkAssignment {
  id: number;
  work_id: number;

  assigned_date: string;
  updated_date: string;
  actual_date: string;

  status: "not-started" | "inprogress" | "fixed";

  comments: string;

  created_at: string;
  created_by: string | null;

  updated_at: string;
  updated_by: string | null;

  team_member: string;

  project_id: number;
  project_name: string;

  description: string;

  category: string;
  subcategory: string;
  tab: string;
}

export type WorkAssignmentResponse = {
  data: {
    workassignment: WorkAssignment[];
  };
};

export interface UpdateWorkStatusPayload {
  work_id: number;
  project_id: number;
  project_name: string;

  category: string;
  subcategory: string;
  tab: string;

  status: "not-started" | "inprogress" | "fixed";

  description: string;
  comments: string;

  created_at: string;
  created_by: string | null;

  updated_at: string;
  updated_by: string | null;

  assigned_to?: {
    id: number;
    name: string;
  };
}

export interface UpdateWorkPayload {
  data: UpdateWorkStatusPayload[];
}

export interface UpdateAssignment {
  work_id: number;
  category: string;
  subcategory: string;
  description: string;

  status: "not-started" | "inprogress" | "fixed";

  comments: string;

  team_member_id: number;
}

export interface UpdateWorkStatusResponse {
  data: {
    assignments: UpdateAssignment[];
  };
}
