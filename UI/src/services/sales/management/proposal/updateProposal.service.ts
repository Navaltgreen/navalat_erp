import { dataApi } from "../../../../config/axios/dataApi";

import type { CreateProposalRequest } from "../../../../types/sales/proposal/proposal.post.request";

export async function updateProposal(
  id: number,
  payload: CreateProposalRequest,
) {
  const response = await dataApi.put(
    `api/v1/sales/proposals/${id}/update_proposal/`,
    payload,
  );

  return response;
}
