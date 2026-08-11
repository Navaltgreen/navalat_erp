import { dataApi } from "../../config/axios/dataApi";

export type RequestProposalBody = {
  milestoneId: number;
  project_id: number;

  invoice_no: string;
  invoice_date: string;
  invoice_to: number;
  invoice_by: number;
  invoice_attachment?: string;
};

export async function requestInvoiceUpdateMileStonesMutate({
  milestoneId,
  ...payload
}: RequestProposalBody) {
  const response = await dataApi.put(
    `/api/v1/project/milestones/${milestoneId}/invoice/`,
    payload,
  );

  return response.data;
}
