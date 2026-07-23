import type { ReactNode } from "react";

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message?: string;
}

export interface Field {
  label: string;
  name: keyof ProjectPayload;
  type: "text" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  icon?: ReactNode;
  rules?: ValidationRule[];
}

export interface ModuleItem {
  main_tab: string;
  sub_tab: string[];
}

export interface ProjectPayload {
  client_id: string;
  project_name: string;
  team_id: { label: string; value: string }[];
  modules: ModuleItem[];
  tabs?: string[];
  subcategory?: string[];
  category?: string[];
}

export type FormErrors = Partial<Record<keyof ProjectPayload, string>>;

export type Client = {
  id: number;
  name: string;
  email: string | null;
  phone_number: number | null;
  country: string | null;
  address: string | null;
};

export type ClientsResponse = {
  success: boolean;
  message: string;
  data: { clients: Client[] };
  meta: Record<string, unknown>;
};

export interface TeamOption {
  label: string;
  value: string;
}

export interface TeamsData {
  teams: TeamOption[];
}

export interface TeamsResponse {
  success: boolean;
  message: string;
  data: TeamsData;
  meta: Record<string, unknown>;
}

export interface ProjectClient {
  id: number;
  name: string;
}

export interface CreatedProject {
  id: number;
  name: string;

  client: ProjectClient | null;

  team_id: TeamOption[];
  tab: string[];
  category: string[];
  subcategory: string[];

  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: CreatedProject;

  meta: {
    status_code: number;
  };
}
