import { dataApi } from "../../../../config/axios/dataApi";
import type { requestProposalBody } from "../../../../types/sales/leads/requestProposal.request";

export async function requestProposalStatus(id: number, payload: requestProposalBody) {
  const response = await dataApi.post(
    `/api/v1/sales/leads/${id}/convert/`,
    payload,
  );
  return response;
}
