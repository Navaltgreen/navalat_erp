import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestAccountsEditMileStonesMutate,
  type RequestProposalBody,
} from "../../services/accounts/requestAccountsEditMilestonesMutate.post.service";
import { MileStoneHistoryQueryKeys } from "./milestones.total.get.query";
import { milestoneQueryKeys } from "../sales/deals/milestones.get.query";
export function useAccountsEditMileStones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestProposalBody) =>
      requestAccountsEditMileStonesMutate(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["milestonesedit"],
      });

      await queryClient.refetchQueries({
        queryKey: milestoneQueryKeys.all,
        type: "all",
      });
      await queryClient.refetchQueries({
        queryKey: MileStoneHistoryQueryKeys.all,
        type: "all",
      });
    },
  });
}
