import { dataApi } from "../../../config/axios/dataApi";
import type {
  SalesPrefilters,
  SalesPrefiltersApiResponse,
} from "../../../types/sales/prefilters.response";

const SALES_PREFILTERS_ENDPOINT = "api/v1/sales/leads/prefilters";

export async function getSalesPrefilters(
  module: string,
): Promise<SalesPrefilters> {
  const response = await dataApi.get<SalesPrefiltersApiResponse>(
    SALES_PREFILTERS_ENDPOINT,
    {
      params: { module },
    },
  );

  const filters = response.data.data?.filters;

  return {
    division: filters?.division ?? [],
    client: filters?.client ?? [],
    picForProposal: filters?.pic_for_proposal ?? [],
  };
}
