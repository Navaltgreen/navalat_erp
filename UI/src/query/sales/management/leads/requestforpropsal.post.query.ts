import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestProposalStatus } from "../../../../services/sales/management/leads/requestProposalStatus.post.service";
import { proposalsQueryKeys } from "../proposal/get.query";

type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
};
export function useRequestProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_converted }: RequestProposalPayload) =>
      requestProposalStatus(id, { is_converted }),

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
