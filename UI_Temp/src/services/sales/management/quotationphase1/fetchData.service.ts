import { dataApi } from "../../../../config/axios/dataApi";

import { mapQuotationResponseToListModel } from "../../../../types/sales/quotationphase1/quotation.mapper";

import type { QuotationResponse } from "../../../../types/sales/quotationphase1/quotation.response";

export async function getQuotationRecords() {
  const response = await dataApi.get<QuotationResponse>(
    "/api/v1/sales/quotations/v1/",
  );

  return mapQuotationResponseToListModel(response.data);
}
