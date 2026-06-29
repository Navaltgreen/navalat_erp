export type FleetResponse = {
  id: string;
  name: string;
  label: string;
};

export type FleetListResponse = {
  fleets: FleetResponse[];
};
