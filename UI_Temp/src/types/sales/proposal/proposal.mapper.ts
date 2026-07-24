import type { ProposalListModel, ProposalModel } from "./proposal.model";
import type {
  ProposalResponseItem,
  ProposalResponse,
} from "./proposal.response";
export function mapLeadsResponseToModel(
  proposal: ProposalResponseItem,
): ProposalModel {
  return {
    id: proposal.id,
    serialNumber: proposal.sl_no ?? 0,
    name: proposal.name ?? "",
    title: proposal.title ?? "",
    priority: proposal.priority ?? "",
    date: proposal.date ?? "",
    division: proposal.division ?? "",
    client: proposal.client ?? "",
    email: proposal.email ?? "",
    phone: proposal.phone ?? "",
    proposal_no: proposal.proposal_number ?? null,
    pic: proposal.pic_for_proposal ?? "",
    attachments: proposal.attachment ?? "",
    remark: proposal.remarks ?? "",
    proposal_status: proposal.proposal_status ?? "",

    request_for_sales_quotation: proposal.is_converted ?? false,
  };
}
export function mapLeadsResponseToListModel(
  response: ProposalResponse,
): ProposalListModel {
  return {
    records: response.data.table_data.map(mapLeadsResponseToModel),
  };
}
