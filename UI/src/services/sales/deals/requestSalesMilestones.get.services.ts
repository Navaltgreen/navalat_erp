import { dataApi } from "../../../config/axios/dataApi";
import type { MileStoneResponse } from "../../../types/sales/deals/milestones.response";

export const getMileStones = async (
  projectId: number,
  startDate?: string | null,
  endDate?: string | null,
): Promise<MileStoneResponse> => {
  const params: Record<string, string> = {
    project_id: String(projectId),
  };

  if (startDate) {
    params.start_date = startDate;
  }
  if (endDate) {
    params.end_date = endDate;
  }
  const { data } = await dataApi.get(`/api/v1/project/milestones/`, {
    params,
  });
  return data;
};
