import { dataApi } from "../../../../config/axios/dataApi";
import type { AssignWorkPayload, TeamMembersResponse, WorkListResponse } from "../../../../types/oceanix/works/work_list";

export const getWorkList = async (params?: {
  project_id?: number;
}): Promise<WorkListResponse> => {
  const { data } = await dataApi.get("api/v1/works/",{params});
  return data;
};

export const getTeamMembers = async (params?: {
  team_id?: number;
  role?: string;
}): Promise<TeamMembersResponse> => {
  const { data } = await dataApi.get("api/v1/teams/members/", { params });
  return data;
};

export const assignWork = async (
  payload: AssignWorkPayload,
): Promise<TeamMembersResponse> => {
  const { data } = await dataApi.post("api/v1/workassignments/", payload);
  return data;
};