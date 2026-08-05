import { dataApi } from "../../../../config/axios/dataApi";
import { mapLeadsResponseToListModel } from "../../../../types/sales/leads/leads.mapper";
import type { LeadsResponse } from "../../../../types/sales/leads/leads.response";

export async function getLeadsRecords() {
  const response = await dataApi.get<LeadsResponse>("api/v1/sales/leads/");

  return mapLeadsResponseToListModel(response.data);
}
