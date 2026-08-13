import { dataApi } from "../../../../config/axios/dataApi";

import { mapQuotationResponseToListModel } from "../../../../types/sales/purchase/quotation.mapper";

import type { QuotationResponse } from "../../../../types/sales/purchase/quotation.response";

export async function getQuotationRecords() {
  const response = await dataApi.get<QuotationResponse>(
    "/api/v1/sales/purchase/",
  );

  return mapQuotationResponseToListModel(response.data);
}
