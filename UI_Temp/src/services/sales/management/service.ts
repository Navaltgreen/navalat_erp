import { dataApi } from "../../../config/axios/dataApi";
import { mapSalesResponseToListModel } from "../../../types/sales/management.mapper";
import type {
  SalesLeadCreateRequest,
  SalesLeadUpdateRequest,
} from "../../../types/sales/management.request";
import type {
  SalesListModel,
  SalesRecord,
  SalesStage,
} from "../../../types/sales/management.model";
import type { SalesManagementResponse } from "../../../types/sales/management.response";

type GetSalesRecordsParams = {
  stage: SalesStage;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
};

type DeleteSalesRecordParams = {
  stage: SalesStage;
  id: number;
};

type SalesActionParams = {
  stage: SalesStage;
  action: "yes" | "no";
  record: SalesRecord;
  userRole: string;
};

const salesEndpointByStage: Record<SalesStage, string> = {
  leads: "api/v1/sales/leads/",
  proposal: "api/v1/sales/proposals/",
  quotation_phase_1: "api/v1/sales/quotation-phase-1/",
  quotation_phase_2: "api/v1/sales/quotation-phase-2/",
  quotation_phase_3: "api/v1/sales/quotation-phase-3/",
  purchase: "api/v1/sales/purchase-orders/",
};

function getSalesEndpoint(stage: SalesStage): string {
  return salesEndpointByStage[stage];
}

export async function createSalesLead(
  payload: SalesLeadCreateRequest,
): Promise<void> {
  await dataApi.post(getSalesEndpoint("leads"), payload);
}

export async function updateSalesLead(
  id: number,
  payload: SalesLeadUpdateRequest,
): Promise<void> {
  await dataApi.put(`${getSalesEndpoint("leads")}${id}/`, payload);
}

export async function getSalesRecords({
  stage,
  startDate,
  endDate,
  page,
  pageSize,
}: GetSalesRecordsParams): Promise<SalesListModel> {
  const endpoint = getSalesEndpoint(stage);
  const response = await dataApi.get<SalesManagementResponse>(endpoint, {
    params: {
      start_date: startDate,
      end_date: endDate,
      page,
      page_size: pageSize,
    },
  });

  return mapSalesResponseToListModel(response.data, stage);
}

export async function deleteSalesRecord({
  stage,
  id,
}: DeleteSalesRecordParams): Promise<void> {
  const endpoint = `${getSalesEndpoint(stage)}${id}/`;

  await dataApi.put(endpoint, {
    is_deleted: true,
  });
}

export async function postSalesAction({
  stage,
  action,
  record,
  userRole,
}: SalesActionParams): Promise<void> {
  const endpoint = getSalesEndpoint(stage);

  await dataApi.post(endpoint, {
    ...record,
    action,
    role: userRole,
  });
}
