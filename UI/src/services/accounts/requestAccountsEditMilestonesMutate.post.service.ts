import { dataApi } from "../../config/axios/dataApi";

export type RequestProposalBody = {
  milestoneId: number;
  project_id: number;

  status?: string;
  received_amount?: number;
  remarks?: string;
  payment_type?: string;
};

export async function requestAccountsEditMileStonesMutate({
  milestoneId,
  ...payload
}: RequestProposalBody) {
  const response = await dataApi.post(
    `/api/v1/project/milestones/${milestoneId}/update_received_amount/`,
    payload,
  );

  return response.data;
}
