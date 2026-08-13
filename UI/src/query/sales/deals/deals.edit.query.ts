import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesEditDealsMutate } from "../../../services/sales/deals/requestSalesEditDealsMutate.edit.service.ts";
import { dealsQueryKeys } from "./deals.get.query.ts";
// import { requestSalesMileStoneMutate } from "../../../services/sales/deals/requestSalesMilestonesStatus.post.service";
type RequestProposalPayload = {
  projectId: number;
  name: string;
};
export function useSalesEditDeals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, name }: RequestProposalPayload) =>
      requestSalesEditDealsMutate(projectId, { name }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dealsedit"],
      });
      await queryClient.refetchQueries({
        queryKey: dealsQueryKeys.all,
        type: "all",
      });
    },
  });
}
