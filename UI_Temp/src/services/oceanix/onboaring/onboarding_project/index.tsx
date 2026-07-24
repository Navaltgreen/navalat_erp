import { dataApi } from "../../../../config/axios/dataApi";
import type {
  ClientsResponse,
  CreateProjectResponse,
  ProjectPayload,
  TeamsResponse,
} from "../../../../types/oceanix/onboarding/onboarding_project";

export const getAllClients = async (): Promise<ClientsResponse> => {
  const { data } = await dataApi.get("/api/v1/clients/");
  return data;
};

export const getAllTeams = async (): Promise<TeamsResponse> => {
  const { data } = await dataApi.get("/api/v1/teams/all/");
  return data;
};

export const createProject = async (
  payload: ProjectPayload,
): Promise<CreateProjectResponse> => {
  const { data } = await dataApi.post("/api/v1/projects/", payload);
  return data;
};
