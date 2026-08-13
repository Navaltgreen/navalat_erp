import { dataApi } from "../../../../config/axios/dataApi";

import { mapLeadsResponseToListModel } from "../../../../types/sales/proposal/proposal.mapper";

import type { ProposalResponse } from "../../../../types/sales/proposal/proposal.response";

export async function getProposalsRecords() {
  const response = await dataApi.get<ProposalResponse>(
    "/api/v1/sales/proposals/get_proposals/",
  );

  return mapLeadsResponseToListModel(response.data);
}
