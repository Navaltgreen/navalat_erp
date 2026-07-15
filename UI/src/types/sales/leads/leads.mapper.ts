import type { LeadsListModel, LeadsModel } from "./leads.model";
import type { LeadsResponseItem, LeadsResponse } from "./leads.response";
export function mapLeadsResponseToModel(lead: LeadsResponseItem): LeadsModel {
  return {
    id: lead?.id,
    serialNumber: lead?.sl_no,
    name: lead?.name,
    title: lead?.title,
    priority: lead?.priority,
    date: lead?.date,
    division: lead?.division,
    client: lead?.client,
    email: lead?.email,
    phone: lead?.phone,
    remark: lead?.remarks,
    leadStatus: lead?.lead_status,
    leadSource: lead?.lead_source,
    lastActivity: lead?.last_activity,
    pic: lead?.pic,
    requestForProposal: lead?.is_converted ?? false,
  };
}
export function mapLeadsResponseToListModel(
  response: LeadsResponse,
): LeadsListModel {
  return {
    records: response.data.table_data.map(mapLeadsResponseToModel),
  };
}
