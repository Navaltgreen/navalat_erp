import type {
  SalesListModel,
  SalesRecord,
  SalesStage,
} from "./management.model";
import type {
  SalesManagementResponse,
  SalesRecordResponse,
} from "./management.response";

const dataKeyByStage: Record<
  SalesStage,
  keyof NonNullable<SalesManagementResponse["data"]>
> = {
  leads: "leads",
  proposal: "proposals",
  quotation_phase_1: "quotation_phase_1",
  quotation_phase_2: "quotation_phase_2",
  quotation_phase_3: "quotation_phase_3",
  purchase: "purchase_orders",
};

function mapSalesRecordResponseToModel(item: SalesRecordResponse): SalesRecord {
  return {
    id: item.id,
    slNo: item.sl_no ?? null,
    name: item.name ?? "-",
    title: item.title ?? null,
    date: item.date ?? null,
    division: item.division ?? null,
    client: item.client ?? null,
    email: item.email ?? null,
    phone: item.phone ?? null,
    remarks: item.remarks ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
    leadStatus: item.lead_status ?? null,
    leadSource: item.lead_source ?? null,
    lastActivity: item.last_activity ?? null,
    pic: item.pic ?? null,
    proposalNumber: item.proposal_number ?? null,
    picForProposal: item.pic_for_proposal ?? null,
    attachment: item.attachment ?? null,
    lead: item.lead ?? null,
    quotationNumber: item.quotation_number ?? null,
    quotation: item.quotation ?? null,
    purchaseOrderNumber: item.purchase_order_number ?? null,
    amount: item.amount ?? null,
  };
}

export function mapSalesResponseToListModel(
  response: SalesManagementResponse,
  stage: SalesStage,
): SalesListModel {
  const payload = response.data;

  if (!payload) {
    return { records: [], total: 0 };
  }

  const key = dataKeyByStage[stage];
  const records = (
    (payload[key] as SalesRecordResponse[] | undefined) ??
    payload.results ??
    []
  ).map(mapSalesRecordResponseToModel);

  const total = response.meta?.total ?? payload.count ?? records.length;

  return {
    records,
    total,
  };
}
