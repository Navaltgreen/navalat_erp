import { dataApi } from "../../config/axios/dataApi";
import type { MileStoneHistoryResponse } from "../../types/accounts/milestones.response";

export async function getMileStoneHistory(projectId: number) {
  const { data } = await dataApi.get<MileStoneHistoryResponse>(
    `/api/v1/project/payment-history`,
    {
      params: { milestone_id: projectId },
    },
  );

  return data;
}
