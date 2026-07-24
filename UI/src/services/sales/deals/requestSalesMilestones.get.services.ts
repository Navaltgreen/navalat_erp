import { dataApi } from "../../../config/axios/dataApi";
import type { MileStoneResponse } from "../../../types/sales/deals/milestones.response";


export const getMileStones = async (projectId: number): Promise<MileStoneResponse> => {
  const { data } = await dataApi.get(
    `/api/v1/project/milestones/?project_id=${projectId}`,
  );
  return data;
};

