import type { VesselItem } from "./vessel.model";
import type { VesselResponse } from "./vessel.response";

export function mapVesselResponseToModel(vessel: VesselResponse): VesselItem {
  return {
    id: vessel.id,
    name: vessel.name,
    imo: vessel.imo,
  };
}
