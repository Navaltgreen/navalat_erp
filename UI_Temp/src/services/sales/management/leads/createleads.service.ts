import { dataApi } from "../../../../config/axios/dataApi";
import { mapCreateLeadResponseToModel } from "../../../../types/sales/leads/leads.post.mapper";
import type { CreateLeadResponse } from "../../../../types/sales/leads/leads.post.response";
import type { CreateLeadRequest } from "../../../../types/sales/leads/leads.post.request";

export async function createLead(payload: CreateLeadRequest) {
  const response = await dataApi.post<CreateLeadResponse>(
    "api/v1/sales/leads/",
    payload,
  );

  return mapCreateLeadResponseToModel(response.data);
}
