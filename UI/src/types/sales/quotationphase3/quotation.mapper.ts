import type { QuotationListModel, QuotationModel } from "./quotation.model";
import type {
  QuotationResponseItem,
  QuotationResponse,
} from "./quotation.response";
export function mapQuotationResponseToModel(
  quotation: QuotationResponseItem,
): QuotationModel {
  return {
    id: quotation.id,
    serialNumber: quotation.sl_no ?? 0,
    name: quotation.name ?? "",
    title: quotation.title ?? "",
    date: quotation.date ?? "",
    division: quotation.division ?? "",
    client: quotation.client ?? "",
    email: quotation.email ?? "",
    phone: quotation.phone ?? "",
    status: quotation.status ?? "",
    amount: quotation.amount ?? "",
    sales_quotation_number: quotation.quotation_number ?? 0,
    pic: quotation.pic ?? "",
    attachments: quotation.attachment ?? "",
    remark: quotation.remarks ?? "",
    request_for_sales_quotation: quotation.is_converted ?? false,
    version: quotation.version ?? 0,
    quotation_status: quotation.quotation_status ?? "",
  };
}
export function mapQuotationResponseToListModel(
  response: QuotationResponse,
): QuotationListModel {
  return {
    records: response.data.quotations.map(mapQuotationResponseToModel),
  };
}
