import { dataApi } from "../../../../config/axios/dataApi";
import type { LeadHistoryItem } from "../../../../types/sales/leads/history.model";
import type {
  LeadHistoryEnvelope,
  LeadHistoryResponseItem,
} from "../../../../types/sales/leads/history.response";

function mapLeadHistoryItem(item: LeadHistoryResponseItem): LeadHistoryItem {
  return {
    phase: item.phase,
    id: item.id,
    name: item.name ?? null,
    status: item.status ?? null,
    createdAt: item.created_at,
    convertedDate: item.converted_date ?? null,
    proposalNumber: item.proposal_number ?? null,
    quotationNumber: item.quotation_number ?? null,
    purchaseOrderNumber: item.purchase_order_number ?? null,
    version: item.version ?? null,
    amount: item.amount ?? null,
  };
}

export async function getLeadHistory(
  leadId: number,
): Promise<LeadHistoryItem[]> {
  const response = await dataApi.get<LeadHistoryEnvelope>(
    "/api/v1/sales/dashboard/history",
    {
      params: { lead_id: leadId },
    },
  );

  const history = response.data.data?.history;

  if (!history) {
    return [];
  }

  return history.map(mapLeadHistoryItem);
}
