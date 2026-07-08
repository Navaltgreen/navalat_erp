import axios from "axios";
import { dataApi } from "../../../../config/axios/dataApi";

import type { CreateProposalRequest } from "../../../../types/sales/proposal/proposal.post.request";

type ProposalNumberCheckResponse = {
  check: boolean;
};

export async function updateProposal(
  id: number,
  payload: CreateProposalRequest,
) {
  const response = await dataApi.put(
    `api/v1/sales/proposals/${id}/update_proposal/`,
    payload,
  );

  return response;
}

export async function checkProposalNumber(
  id: number,
  proposalNumber: number,
): Promise<boolean> {
  console.log(id,proposalNumber)
  try {
    const response = await dataApi.get<ProposalNumberCheckResponse>(
      `api/v1/sales/proposals/check_proposal_number`,
      // {
      //   proposal_number: proposalNumber,
      // },
      {
        params: {
          proposal_number: proposalNumber,
        },
      },
    );

    return response.data.check;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return true;
    }

    throw error;
  }
}
