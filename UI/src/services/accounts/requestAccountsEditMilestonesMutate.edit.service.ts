import { dataApi } from "../../config/axios/dataApi";

export type RequestProposalBody = {
  milestoneId: number;
  project_id: number;

  status?: string;
  received_amount?: number;
  remarks?:string;
};

export async function requestAccountsEditMileStonesMutate({
  milestoneId,
  ...payload
}: RequestProposalBody) {
  const response = await dataApi.put(
    `/api/v1/project/milestones/${milestoneId}/`,
    payload,
  );

  return response.data;
}
