import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUpQuotation } from "../../../../services/sales/management/proposal/followUpQuotation.service";
import { proposalQuotationsQueryKeys } from "./quotations.query";

export function useQuotationFollowUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quotationId: number) => followUpQuotation(quotationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: proposalQuotationsQueryKeys.all,
      });
    },
  });
}
