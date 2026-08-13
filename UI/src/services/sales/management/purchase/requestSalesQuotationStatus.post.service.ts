import { dataApi } from "../../../../config/axios/dataApi";
import type { requestQuotationBody } from "../../../../types/sales/leads/requestProposal.request";

export async function requestSalesQuotationMutate(
  id: number,
  payload: requestQuotationBody,
) {
  const response = await dataApi.put(
    `/api/v1/sales/quotations/${id}/update_phase/`,

    payload,
  );
  return response;
}
