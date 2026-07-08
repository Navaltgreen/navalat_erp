import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SalesStage } from "../../../types/sales/management.model";

const defaultRange = [
  dayjs().subtract(3, "month").format("YYYY-MM-DD"),
  dayjs().format("YYYY-MM-DD"),
] as const;

type SalesManagementStoreState = {
  selectedStage: SalesStage;
  dateRange: readonly [string, string];
  page: number;
  pageSize: number;
  setSelectedStage: (stage: SalesStage) => void;
  setDateRange: (dateRange: readonly [string, string]) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
};

export const useSalesManagementStore = create<SalesManagementStoreState>()(
  persist(
    (set) => ({
      selectedStage: "leads",
      dateRange: defaultRange,
      page: 1,
      pageSize: 10,
      setSelectedStage: (selectedStage) => set({ selectedStage }),
      setDateRange: (dateRange) => set({ dateRange }),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize }),
      resetFilters: () =>
        set({
          selectedStage: "leads",
          dateRange: defaultRange,
          page: 1,
          pageSize: 10,
        }),
    }),
    {
      name: "sales-management-store",
    },
  ),
);
