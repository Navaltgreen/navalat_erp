import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestProposalStatus } from "../../../../services/sales/management/leads/requestProposalStatus.post.service";
import { proposalsQueryKeys } from "../proposal/get.query";

type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
  lead_status: "Approved" | "Declined" | "Pending";
};
export function useRequestProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_converted, lead_status }: RequestProposalPayload) =>
      requestProposalStatus(id, { is_converted, lead_status }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
      await queryClient.refetchQueries({
              queryKey: proposalsQueryKeys.all,
              type: "all",
            });
    },
  });
}
