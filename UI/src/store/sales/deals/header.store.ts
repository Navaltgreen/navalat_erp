import { create } from "zustand";

type SalesDealsHeaderStoreState = {
  dateRange: [string, string];
  dealsPhaseActive: string;
  dealsPhases: { value: string; label: string }[];
  setDealsPhase: (phase: string) => void;
};

const useSalesDealsHeaderStore = create<SalesDealsHeaderStoreState>((set) => ({
  dateRange: ["2015-06-06", "2015-06-06"],
  dealsPhaseActive: "deals",
  dealsPhases: [{ value: "deals", label: "Deals" }],
  setDealsPhase: (phase: string) => {
    set((state) => {
      return {
        ...state,
        dealsPhaseActive: phase,
      };
    });
  },
}));
export default useSalesDealsHeaderStore;
