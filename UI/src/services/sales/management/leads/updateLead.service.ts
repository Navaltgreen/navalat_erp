import { dataApi } from "../../../../config/axios/dataApi";

import type { UpdateLeadResponse } from "../../../../types/sales/leads/leads.update.response";
import type { CreateLeadRequest } from "../../../../types/sales/leads/leads.post.request";

export async function updateLead(id: number, payload: CreateLeadRequest) {
  const response = await dataApi.put<UpdateLeadResponse>(
    `api/v1/sales/leads/${id}/update_lead/`,
    payload,
  );

  return response;
}
