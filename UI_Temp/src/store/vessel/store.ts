import { create } from "zustand";
import type { ApiError } from "../../types/common/api";
import type { VesselItem } from "../../types/vessel/vessel.model";

type VesselStoreState = {
  data: VesselItem[];
  error: ApiError | null;
  selectedId: number | null;
  selectedName: string | null;
  selectedImo: string | null;
  setData: (vessels: VesselItem[]) => void;
  setError: (error: ApiError | null) => void;
  resetData: () => void;
  setSelectedVessel: (vessel: VesselItem | null) => void;
};

export const useVesselStore = create<VesselStoreState>((set) => ({
  data: [],
  error: null,
  selectedId: null,
  selectedName: null,
  selectedImo: null,
  setData: (data) => set({ data, error: null }),
  setError: (error) =>
    set({
      error,
      data: [],
      selectedId: null,
      selectedName: null,
      selectedImo: null,
    }),
  resetData: () =>
    set({
      data: [],
      error: null,
      selectedId: null,
      selectedName: null,
      selectedImo: null,
    }),
  setSelectedVessel: (vessel) =>
    set({
      selectedId: vessel?.id ?? null,
      selectedName: vessel?.name ?? null,
      selectedImo: vessel?.imo ?? null,
    }),
}));
