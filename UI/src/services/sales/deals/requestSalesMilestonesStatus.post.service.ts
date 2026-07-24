import { dataApi } from "../../../config/axios/dataApi";

type requestProposalBody = {
  remarks: string;
  amount: number;
  start_date: string;
  end_date: string;
  project_id: number;
  pic: number;
};

export async function requestSalesMileStoneMutate(
  payload: requestProposalBody,
) {
  const response = await dataApi.post(`/api/v1/project/milestones/`, payload);
  return response;
}
