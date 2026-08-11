import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestInvoiceUpdateMileStonesMutate,
  type RequestProposalBody,
} from "../../services/accounts/requestInvoiceUpdateMilestonesMutate.put.service";
// import { MileStoneHistoryQueryKeys } from "./milestones.get.query";
// import { milestoneQueryKeys } from "../sales/deals/milestones.get.query";
export function useInvoiceUpdateMileStones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestProposalBody) =>
      requestInvoiceUpdateMileStonesMutate(payload),

    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["invoice-generation"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["milestones", variables.project_id],
      });

      // await queryClient.refetchQueries({
      //   queryKey: milestoneQueryKeys.all,
      //   type: "all",
      // });
      // await queryClient.refetchQueries({
      //   queryKey: MileStoneHistoryQueryKeys.all,
      //   type: "all",
      // });
    },
  });
}
