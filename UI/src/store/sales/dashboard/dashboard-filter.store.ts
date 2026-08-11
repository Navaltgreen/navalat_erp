import { create } from "zustand";

export type PeriodType = "month" | "quarterly" | "yearly";

type Option<T> = { label: string; value: T };

export const MONTH_OPTIONS: Option<number>[] = [
  { label: "Jan", value: 1 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Apr", value: 4 },
  { label: "May", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Aug", value: 8 },
  { label: "Sep", value: 9 },
  { label: "Oct", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Dec", value: 12 },
];

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export const QUARTER_OPTIONS: Option<Quarter>[] = [
  { label: "Q1", value: "Q1" },
  { label: "Q2", value: "Q2" },
  { label: "Q3", value: "Q3" },
  { label: "Q4", value: "Q4" },
];

export const YEAR_OPTIONS: Option<number>[] = Array.from(
  { length: 2028 - 2020 + 1 },
  (_, i) => {
    const year = 2020 + i;
    return { label: String(year), value: year };
  },
);

type DashboardFilterState = {
  year: number;
  periodType: PeriodType;
  month: number;
  quarter: Quarter;

  setYear: (year: number) => void;
  setPeriodType: (periodType: PeriodType) => void;
  setMonth: (month: number) => void;
  setQuarter: (quarter: Quarter) => void;
  reset: () => void;
};

const DEFAULT_STATE = {
  year: 2026,
  periodType: "month" as PeriodType,
  month: 1,
  quarter: "Q1" as Quarter,
};

export const useDashboardFilterStore = create<DashboardFilterState>((set) => ({
  ...DEFAULT_STATE,

  setYear: (year) => set({ year }),
  setPeriodType: (periodType) => set({ periodType }),
  setMonth: (month) => set({ month }),
  setQuarter: (quarter) => set({ quarter }),
  reset: () => set({ ...DEFAULT_STATE }),
}));
