import { dataApi } from "../../config/axios/dataApi";
export type MileStoneProjectAmount = {
  project_amount_id: number;
  invoiced_amount: number;
  received_amount: number;
};
export type MileStoneHistoryResponse = {
  data: {
    project_id: number;
    total_invoiced_amount: number;
    total_received_amount: number;
    project_amounts: MileStoneProjectAmount[];
  };
  message: string;
};

export async function getMileStoneHistory(milestoneId: number) {
  const { data } = await dataApi.get<MileStoneHistoryResponse>(
    `api/v1/project/milestones/invoice-summary/?project_id=${milestoneId}`,
  );

  return data;
}
