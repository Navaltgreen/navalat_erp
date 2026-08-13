import { useEffect } from "react";

type AppError = {
  code: string;
  message: string;
};

type QueryLikeResult<TData, TError = Error> = {
  data: TData;
  error: TError | null;
};

type UseQueryToStoreSyncOptions<TQueryData, TStoreData, TError = Error> = {
  query: QueryLikeResult<TQueryData, TError>;
  mapData?: (queryData: TQueryData) => TStoreData;
  shouldReset?: (queryData: TQueryData) => boolean;
  setData: (data: TStoreData) => void;
  setError: (error: AppError | null) => void;
  resetData?: () => void;
  mapError?: (error: TError) => AppError;
};

const defaultMapError = (error: unknown): AppError => ({
  code: "request_failed",
  message: error instanceof Error ? error.message : "Unknown error",
});

export const useQueryToStoreSync = <TQueryData, TStoreData, TError = Error>({
  query,
  mapData,
  shouldReset,
  setData,
  setError,
  resetData,
  mapError,
}: UseQueryToStoreSyncOptions<TQueryData, TStoreData, TError>) => {
  useEffect(() => {
    if (query.error) {
      const resolvedError = mapError
        ? mapError(query.error)
        : defaultMapError(query.error);
      setError(resolvedError);
      if (resetData) {
        resetData();
      }
      return;
    }

    if (shouldReset?.(query.data)) {
      setError(null);
      if (resetData) {
        resetData();
      }
      return;
    }

    setError(null);
    const resolvedData = mapData
      ? mapData(query.data)
      : (query.data as unknown as TStoreData);
    setData(resolvedData);
  }, [
    mapData,
    mapError,
    query.data,
    query.error,
    resetData,
    setData,
    setError,
    shouldReset,
  ]);
};
