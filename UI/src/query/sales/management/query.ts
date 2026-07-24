import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSalesLead,
  deleteSalesRecord,
  getSalesRecords,
  postSalesAction,
  updateSalesLead,
} from "../../../services/sales/management/service";
import type {
  SalesRecord,
  SalesStage,
} from "../../../types/sales/management.model";
import type { SalesLeadCreateRequest } from "../../../types/sales/management.request";
import type { SalesLeadUpdateRequest } from "../../../types/sales/management.request";

type UseSalesRecordsQueryParams = {
  stage: SalesStage;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
};

type DeleteSalesRecordPayload = {
  stage: SalesStage;
  id: number;
};

type SalesActionPayload = {
  stage: SalesStage;
  action: "yes" | "no";
  record: SalesRecord;
  userRole: string;
};

type CreateSalesLeadPayload = SalesLeadCreateRequest;

type UpdateSalesLeadPayload = {
  id: number;
  payload: SalesLeadUpdateRequest;
};

export const salesQueryKeys = {
  all: ["sales-management"] as const,
  list: ({
    stage,
    startDate,
    endDate,
    page,
    pageSize,
  }: UseSalesRecordsQueryParams) =>
    [
      ...salesQueryKeys.all,
      { stage, startDate, endDate, page, pageSize },
    ] as const,
};

export function useSalesRecordsQuery(params: UseSalesRecordsQueryParams) {
  const query = useQuery({
    queryKey: salesQueryKeys.list(params),
    queryFn: () => getSalesRecords(params),
    refetchOnMount: false,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data ?? { records: [], total: 0 },
    error: query.error ?? null,
    refetch: query.refetch,
  };
}

export function useDeleteSalesRecordMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: DeleteSalesRecordPayload) =>
      deleteSalesRecord(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: salesQueryKeys.all });
    },
  });

  return {
    deleteRecord: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ?? null,
  };
}

export function useSalesActionMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SalesActionPayload) => postSalesAction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: salesQueryKeys.all });
    },
  });

  return {
    postAction: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ?? null,
  };
}

export function useCreateSalesLeadMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateSalesLeadPayload) => createSalesLead(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: salesQueryKeys.all });
    },
  });

  return {
    createLead: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ?? null,
  };
}

export function useUpdateSalesLeadMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: UpdateSalesLeadPayload) =>
      updateSalesLead(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: salesQueryKeys.all });
    },
  });

  return {
    updateLead: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ?? null,
  };
}
