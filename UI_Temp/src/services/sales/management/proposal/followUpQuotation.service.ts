import { dataApi } from "../../../../config/axios/dataApi";

type FollowUpQuotationPayload = {
  is_convert: true;
  status: "Approved";
};

const FOLLOW_UP_QUOTATION_PAYLOAD: FollowUpQuotationPayload = {
  is_convert: true,
  status: "Approved",
};

export async function followUpQuotation(id: number) {
  const response = await dataApi.put(
    `/api/v1/sales/quotations/${id}/update_quotation/`,
    FOLLOW_UP_QUOTATION_PAYLOAD,
  );

  return response;
}
