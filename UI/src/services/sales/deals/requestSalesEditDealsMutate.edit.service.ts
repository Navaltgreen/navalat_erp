import { dataApi } from "../../../config/axios/dataApi";

type requestProposalBody = {
  name: string;
};

export async function requestSalesEditDealsMutate(
  projectId: number,
  payload: requestProposalBody,
) {
  const response = await dataApi.put(`/api/v1/projects/${projectId}/`, payload);
  return response;
}
