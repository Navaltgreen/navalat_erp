import { dataApi } from "../../../../config/axios/dataApi";
// import type { requestProposalBody } from "../../../../types/sales/leads/requestProposal.request";

type requestProposalBody = {
  is_converted: boolean;
  proposal_status: "Approved" | "Declined" | "Pending";
};
export async function requestSalesProposalMutate(
  id: number,
  payload: requestProposalBody,
) {
  const response = await dataApi.post(
    `/api/v1/sales/proposals/${id}/convert/`,
    payload,
  );
  return response;
}
