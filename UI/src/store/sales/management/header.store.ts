import { create } from "zustand";

type SalesManagementHeaderStoreState = {
  dateRange:[string,string];
  salesPhaseActive: string;
  salesPhases: { value: string; label: string }[];
  setSalesPhase: (phase: string) => void;
};

const useSalesManagementHeaderStore = create<SalesManagementHeaderStoreState>(
  (set) => ({
    dateRange: ["2015-06-06", "2015-06-06"],
    salesPhaseActive: "lead",
    salesPhases: [
      { value: "lead", label: "Lead" },
      { value: "proposal", label: "Proposal" },
      { value: "quotation_phase_one", label: "Quotation Phase One" },
      { value: "quotation_phase_two", label: "Quotation Phase Two" },
      { value: "quotation_phase_three", label: "Quotation Phase Three" },
      { value: "purchase", label: "Purchase" },
    ],
    setSalesPhase: (phase: string) => {
      set((state) => {
        return {
          ...state,
          salesPhaseActive: phase,
        };
      });
    },
  }),
);
export default useSalesManagementHeaderStore;
