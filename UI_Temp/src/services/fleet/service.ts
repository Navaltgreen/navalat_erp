import { dataApi } from "../../config/axios/dataApi";
import type { ApiResponse } from "../../types/common/api";
import { mapFleetResponseToModel } from "../../types/fleet/fleet.mapper";
import type { FleetItem } from "../../types/fleet/fleet.model";
import type { FleetListResponse } from "../../types/fleet/fleet.response";

const FLEETS_ENDPOINT = "http://192.168.54.116:8888/api/v3/withall/fleets";

export async function getFleets(): Promise<FleetItem[]> {
  const response =
    await dataApi.get<ApiResponse<FleetListResponse>>(FLEETS_ENDPOINT);
  const fleets = response.data.data?.fleets;

  if (!fleets) {
    return [];
  }

  return fleets.map(mapFleetResponseToModel);
}
