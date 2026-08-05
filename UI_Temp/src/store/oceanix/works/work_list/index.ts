import { create } from "zustand";
import { assignWork, getTeamMembers, getWorkList } from "../../../../services/oceanix/works/work_list";
import type { AssignWorkPayload, TeamMember, WorkListData } from "../../../../types/oceanix/works/work_list";


interface ClientState {
  loading: boolean;
  error: string | null;
  workList: WorkListData[];
  teamMembers: TeamMember[];
  fetchAllWorkList: (project_id?: number) => Promise<void>;
  fetchTeamMembers: (team_id?: number) => Promise<void>;
  assignWorkToMember: (payload: AssignWorkPayload) => Promise<void>;
}
export const useWorkListStore = create<ClientState>((set) => ({
  loading: false,
  error: null,
  workList: [],
  teamMembers: [],
  fetchAllWorkList: async (project_id?: number) => {
    set({ loading: true, error: null });
    try {
      const res = await getWorkList({ project_id });
      set({
        loading: false,
        workList: res?.data?.works,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch work list";
      set({ loading: false, error: message });
      throw error;
    }
  },
  fetchTeamMembers: async (team_id?: number) => {
    set({ loading: true, error: null });
    try {
      const res = await getTeamMembers({ team_id });

      set({
        loading: false,
        teamMembers: res?.data?.teams,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch Team Members";
      set({ loading: false, error: message });
      throw error;
    }
  },
  assignWorkToMember: async (payload: AssignWorkPayload) => {
    set({ loading: true, error: null });
    try {
       await assignWork(payload);
      set({ loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch Team Members";
      set({ loading: false, error: message });
      throw error;
    }
  },
}));
