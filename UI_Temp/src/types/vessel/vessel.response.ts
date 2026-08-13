export type VesselResponse = {
  id: number;
  name: string;
  imo: string;
};

export type VesselListResponse = {
  vessels: VesselResponse[];
};
