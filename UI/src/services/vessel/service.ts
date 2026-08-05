import { dataApi } from "../../config/axios/dataApi";
import { mapVesselResponseToModel } from "../../types/vessel/vessel.mapper";
import type { ApiResponse } from "../../types/common/api";
import type { VesselItem } from "../../types/vessel/vessel.model";
import type { VesselListResponse } from "../../types/vessel/vessel.response";

const VESSELS_ENDPOINT = "http://192.168.54.116:8888/api/v3/vessels";

type VesselApiResponse = ApiResponse<VesselListResponse> & {
  success?: boolean;
};

export async function getVessels(): Promise<VesselItem[]> {
  const response = await dataApi.get<VesselApiResponse>(VESSELS_ENDPOINT);
  const vessels = response.data.data?.vessels;

  if (!vessels) {
    return [];
  }

  return vessels.map(mapVesselResponseToModel);
}
