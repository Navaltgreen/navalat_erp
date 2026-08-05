import { dataApi } from "../../../../config/axios/dataApi";

import type { DeleteResponse } from "../../../../types/sales/leads/leads.delete.response";

export async function deleteLead(id: number) {
  const response = await dataApi.put<DeleteResponse>(
    `api/v1/sales/leads/${id}/delete_lead/`,
    {
      is_deleted: true,
    },
  );
  return response;
}
