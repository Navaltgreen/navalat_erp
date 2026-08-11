import { dataApi } from "../../config/axios/dataApi";
import type { MileStoneHistoryResponse } from "../../types/accounts/milestones.response";

export async function getMileStoneHistory(projectId: number) {
  const { data } = await dataApi.get<MileStoneHistoryResponse>(
    `/api/v1/project/milestones/invoice-summary/`,
    {
      params: { project_id: projectId },
    },
  );

  return data;
}
