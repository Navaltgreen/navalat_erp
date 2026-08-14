import { create } from "zustand";
import type { Dayjs } from "dayjs";

type AccountsDateFilterState = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setDateRange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  resetDateRange: () => void;
};

const usePaymentHistoryDateFilterStore = create<AccountsDateFilterState>((set) => ({
  startDate: null,
  endDate: null,
  setDateRange: (startDate, endDate) => set({ startDate, endDate }),
  resetDateRange: () => set({ startDate: null, endDate: null }),
}));

export default usePaymentHistoryDateFilterStore;
