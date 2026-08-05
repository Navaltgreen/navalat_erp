import type {
  ProposalQuotationListModel,
  ProposalQuotationModel,
} from "./quotation.model";
import type {
  ProposalQuotationResponse,
  ProposalQuotationResponseItem,
} from "./quotation.response";

export function mapProposalQuotationResponseToModel(
  quotation: ProposalQuotationResponseItem,
): ProposalQuotationModel {
  return {
    id: quotation.id,
    quotationStatus: quotation.quotation_status ?? "",
    version: quotation.version ?? 0,
    quotationNumber: quotation.quotation_number ?? null,
    status: quotation.status ?? "",
    amount: quotation.amount ?? "",
    isConverted: quotation.is_converted ?? false,
    versions: quotation.versions ?? 0,
    remarks: quotation.remarks ?? "",
    pic: quotation.pic ?? "",
    convertedDate: quotation.converted_date ?? "",
    attachment: quotation.attachment ?? "",
  };
}

export function mapProposalQuotationResponseToListModel(
  response: ProposalQuotationResponse,
): ProposalQuotationListModel {
  return {
    records: response.data.quotations.map(mapProposalQuotationResponseToModel),
  };
}
