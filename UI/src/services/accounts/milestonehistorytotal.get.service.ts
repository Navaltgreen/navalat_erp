import { dataApi } from "../../config/axios/dataApi";
import type { MileStoneHistoryResponse } from "../../types/accounts/milestones.response";
export async function getMileStoneHistory(milestoneId: number) {
  const { data } = await dataApi.get<MileStoneHistoryResponse>(
    `api/v1/project/milestones/invoice-summary/?project_id=${milestoneId}`,
  );

  return data;
}
