import { dataApi } from "../../../../config/axios/dataApi";
import type {
  CreateWorkPayload,
  ProjectsResponse,
  WorkCreateResponse,
} from "../../../../types/oceanix/works/work_add";

export const getAllProjects = async (): Promise<ProjectsResponse> => {
  const { data } = await dataApi.get("/api/v1/projects/");
  return data;
};

export const createWork = async (
  payload: CreateWorkPayload,
): Promise<WorkCreateResponse> => {
  const { data } = await dataApi.post("api/v1/works/", payload);
  return data?.data;
};
