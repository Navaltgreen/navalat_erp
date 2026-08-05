import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesMileStoneMutate } from "../../../services/sales/deals/requestSalesMilestonesStatus.post.service";
import { milestoneQueryKeys } from "./milestones.get.query";
type RequestProposalPayload = {
  remarks: string;
  amount: number;
  start_date: string;
  end_date: string;
  project_id: number;
  pic: number;
};
export function useRequestSalesMilestoneStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ...payload }: RequestProposalPayload) =>
      requestSalesMileStoneMutate(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["milestone"],
      });
      await queryClient.refetchQueries({
        queryKey: milestoneQueryKeys.all,
        type: "all",
      });
    },
  });
}
