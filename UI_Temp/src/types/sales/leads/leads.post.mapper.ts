import type { LeadsModel } from "./leads.model";
import type { CreateLeadResponse } from "./leads.post.response";

export function mapCreateLeadResponseToModel(
  response: CreateLeadResponse,
): LeadsModel {
  return {
    id: response.id,
    serialNumber: response.sl_no,
    name: response.name,
    title: response.title,
    priority: null,
    date: response.date,
    division: response.division,
    client: response.client,
    email: response.email,
    phone: response.phone,
    remark: response.remarks,
    leadStatus: response.lead_status,
    leadSource: response.lead_source,
    lastActivity: response.last_activity,
    pic: response.pic,
    requestForProposal: response.is_converted,
  };
}
