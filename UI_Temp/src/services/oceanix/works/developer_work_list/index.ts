import { dataApi } from "../../../../config/axios/dataApi";
import type {
  teamPayload,
  UpdateWorkPayload,
  UpdateWorkStatusResponse,
  WorkAssignmentResponse,
} from "../../../../types/oceanix/works/developer_work_list";

export const getTeamWiseWorkList = async (
  params: teamPayload,
): Promise<WorkAssignmentResponse> => {
  const { data } = await dataApi.get(
    "api/v1/workassignments/assignment-summary/",
    {
      params,
    },
  );
  return data;
};

export const updateWorkStatus = async (
  payload: UpdateWorkPayload,
): Promise<UpdateWorkStatusResponse> => {
  const { data } = await dataApi.post(
    "api/v1/workassignments/update-team-member/",
    {
      payload,
    },
  );
  return data;
};
