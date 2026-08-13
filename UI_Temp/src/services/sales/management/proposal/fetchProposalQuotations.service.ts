import { dataApi } from "../../../../config/axios/dataApi";
import { mapProposalQuotationResponseToListModel } from "../../../../types/sales/proposal/quotation.mapper";
import type { ProposalQuotationResponse } from "../../../../types/sales/proposal/quotation.response";

export async function getProposalQuotationsRecords(proposalId: number) {
  const response = await dataApi.get<ProposalQuotationResponse>(
    `/api/v1/sales/proposals/${proposalId}/quotations/`,
  );

  return mapProposalQuotationResponseToListModel(response.data);
}
