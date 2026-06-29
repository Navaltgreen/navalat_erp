import { dataApi } from "../../../../config/axios/dataApi";

import type { CreateProposalRequest } from "../../../../types/sales/proposal/proposal.post.request";

export async function updateQuotation(
  id: number,
  payload: CreateProposalRequest,
) {
  const response = await dataApi.put(
    `api/v1/sales/quotations/${id}/update_quotation/`,
    payload,
  );

  return response;
}
