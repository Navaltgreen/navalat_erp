import type { UploadFile } from "antd";

export type FieldType = "select" | "upload" | "textarea";

export interface OptionType {
  label: string;
  value: string;
}

export interface FormDataType {
  project?: string;
  tab?: string;
  subtab?: string;
  status?: string;
  description?: string;
  comment?: string;
  images: UploadFile[];
  team_id?: {
    label: string;
    value: string;
  }[];
}

export interface ErrorsType {
  project?: string;
  tab?: string;
  subtab?: string;
  status?: string;
  description?: string;
  comment?: string;
  images?: string;
  team_id?: string;
}

export interface FieldConfig {
  name: keyof FormDataType;
  label: string;
  type: FieldType;
  span: number;
  placeholder?: string;
  options?: OptionType[];
  required?: boolean;
  validationMessage?: string;
}

export interface ProjectsResponse {
  data: { projects: Project[] };
}

export interface Project {
  id: number;
  name: string;
  client: Client | null;
  team_id: TeamId;

  tab: Tab;

  category: string[];
  subcategory: string[];

  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
}

export interface Client {
  id: number;
  name: string;
}
export interface TeamOption {
  label: string;
  value: string;
}

export type TeamId = TeamOption[];
export type Tab = TabType[];

export interface TabType {
  main_tab: string;
  sub_tab: string[];
}

export interface CreateWorkPayload {
  project_id: string;
  category: string;
  subcategory: string;
  status: string;
  description: string;
  comments: string;
  team_id: {
    label: string;
    value: string;
  }[];
  images: File[];
  tab?: string;
}
export interface WorkData {
  id: number;
  project_id: number;
  category: string;
  subcategory: string;
  tab: string;
  status: string;
  images: string;
  description: string;
  comments: string;
  team_id: number[];
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface WorkCreateResponse {
  data: {
    data: WorkData;
  };
}
