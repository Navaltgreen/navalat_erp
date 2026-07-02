import { create } from "zustand";
import type { ApiError } from "../../types/common/api";
import type { SalesTeamMember } from "../../types/sales/team-member.model";

type SalesTeamMembersStoreState = {
  data: SalesTeamMember[];
  error: ApiError | null;
  selectedMemberId: number | null;
  selectedMemberName: string | null;
  setData: (members: SalesTeamMember[]) => void;
  setError: (error: ApiError | null) => void;
  resetData: () => void;
  setSelectedMember: (member: SalesTeamMember | null) => void;
};

export const useSalesTeamMembersStore = create<SalesTeamMembersStoreState>(
  (set) => ({
    data: [],
    error: null,
    selectedMemberId: null,
    selectedMemberName: null,
    setData: (data) =>
      set((state) => {
        const selectedMember = data.find(
          (member) => member.id === state.selectedMemberId,
        );

        return {
          data,
          error: null,
          selectedMemberId: selectedMember?.id ?? data[0]?.id ?? null,
          selectedMemberName: selectedMember?.name ?? data[0]?.name ?? null,
        };
      }),
    setError: (error) =>
      set({
        error,
        data: [],
        selectedMemberId: null,
        selectedMemberName: null,
      }),
    resetData: () =>
      set({
        data: [],
        error: null,
        selectedMemberId: null,
        selectedMemberName: null,
      }),
    setSelectedMember: (member) =>
      set({
        selectedMemberId: member?.id ?? null,
        selectedMemberName: member?.name ?? null,
      }),
  }),
);
