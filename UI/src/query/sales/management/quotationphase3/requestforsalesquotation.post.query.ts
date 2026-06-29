import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesQuotationMutate } from "../../../../services/sales/management/quotationphase3/requestSalesQuotationStatus.post.service";
import { quotationQueryKeys } from "../purchase/get.query";

type RequestProposalPayload = {
  id: number;
  phase: number;
};
export function useRequestSalesQuotationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, phase }: RequestProposalPayload) =>
      requestSalesQuotationMutate(id, { phase }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quotationthree"],
      });
      await queryClient.refetchQueries({
        queryKey: quotationQueryKeys.all,
        type: "all",
      });
    },
  });
}
