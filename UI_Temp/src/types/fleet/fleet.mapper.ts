import type { FleetItem } from "./fleet.model";
import type { FleetResponse } from "./fleet.response";

export function mapFleetResponseToModel(fleet: FleetResponse): FleetItem {
  return {
    id: fleet.id,
    name: fleet.name,
    label: fleet.label,
  };
}
