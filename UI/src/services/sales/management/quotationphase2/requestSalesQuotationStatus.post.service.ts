import { dataApi } from "../../../../config/axios/dataApi";
import type { requestProposalBody } from "../../../../types/sales/quotationphase1/quotation.request";

export async function requestSalesQuotationMutate(
  id: number,
  payload: requestProposalBody,
) {
  const response = await dataApi.put(
    `/api/v1/sales/quotations/${id}/update_phase/`,
    payload,
  );
  return response;
}
