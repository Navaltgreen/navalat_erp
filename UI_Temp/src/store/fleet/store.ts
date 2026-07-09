import { create } from "zustand";
import type { ApiError } from "../../types/common/api";
import type { FleetItem } from "../../types/fleet/fleet.model";

type FleetStoreState = {
  data: FleetItem[];
  error: ApiError | null;
  selectedId: string | null;
  selectedName: string | null;
  selectedLabel: string | null;
  setData: (fleets: FleetItem[]) => void;
  setError: (error: ApiError | null) => void;
  resetData: () => void;
  setSelectedFleet: (fleet: FleetItem | null) => void;
};

export const useFleetStore = create<FleetStoreState>((set) => ({
  data: [],
  error: null,
  selectedId: null,
  selectedName: null,
  selectedLabel: null,
  setData: (data) => set({ data, error: null }),
  setError: (error) =>
    set({
      error,
      data: [],
      selectedId: null,
      selectedName: null,
      selectedLabel: null,
    }),
  resetData: () =>
    set({
      data: [],
      error: null,
      selectedId: null,
      selectedName: null,
      selectedLabel: null,
    }),
  setSelectedFleet: (fleet) =>
    set({
      selectedId: fleet?.id ?? null,
      selectedName: fleet?.name ?? null,
      selectedLabel: fleet?.label ?? null,
    }),
}));
