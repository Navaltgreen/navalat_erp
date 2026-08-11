// src/store/sales/dashboard/dashboard-filter.utils.ts
import type { PeriodType, Quarter } from "./dashboard-filter.store";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function getLastDayOfMonth(year: number, month: number) {
  // month is 1-indexed; new Date(year, month, 0) gives last day of that month
  return new Date(year, month, 0).getDate();
}

const QUARTER_MONTH_RANGES: Record<Quarter, [number, number]> = {
  Q1: [1, 3],
  Q2: [4, 6],
  Q3: [7, 9],
  Q4: [10, 12],
};

export function getDateRangeForFilters(params: {
  year: number;
  periodType: PeriodType;
  month: number;
  quarter: Quarter;
}): { start_date: string; end_date: string } {
  const { year, periodType, month, quarter } = params;

  if (periodType === "month") {
    return {
      start_date: formatDate(year, month, 1),
      end_date: formatDate(year, month, getLastDayOfMonth(year, month)),
    };
  }

  if (periodType === "quarterly") {
    const [startMonth, endMonth] = QUARTER_MONTH_RANGES[quarter];
    return {
      start_date: formatDate(year, startMonth, 1),
      end_date: formatDate(year, endMonth, getLastDayOfMonth(year, endMonth)),
    };
  }

  // yearly
  return {
    start_date: formatDate(year, 1, 1),
    end_date: formatDate(year, 12, 31),
  };
}
