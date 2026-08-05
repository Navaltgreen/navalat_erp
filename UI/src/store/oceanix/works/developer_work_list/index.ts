import { create } from "zustand";
import {
  getTeamWiseWorkList,
  updateWorkStatus,
} from "../../../../services/oceanix/works/developer_work_list";
import type {
  teamPayload,
  UpdateWorkPayload,
  WorkAssignment,
} from "../../../../types/oceanix/works/developer_work_list";

interface ClientState {
  loading: boolean;
  error: string | null;
  workList: WorkAssignment[];
  fetchTeamsWorkList: (payload: teamPayload) => Promise<void>;
  updateWorkStatus: (id: number, status: WorkAssignment["status"]) => void;
  updateAssignmentStatus: (payload: UpdateWorkPayload) => Promise<void>;
}
export const useDeveloperWorkListStore = create<ClientState>((set) => ({
  loading: false,
  error: null,
  workList: [],

  fetchTeamsWorkList: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await getTeamWiseWorkList(payload);
      set({
        loading: false,
        workList: res?.data?.workassignment,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch work list";
      set({ loading: false, error: message });
      throw error;
    }
  },
  updateWorkStatus: (id: number, status: WorkAssignment["status"]) =>
    set((state) => ({
      workList: state.workList.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    })),
  updateAssignmentStatus: async (payload) => {
    set({ loading: true, error: null });
    try {
      await updateWorkStatus(payload);
      set({
        loading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch work list";
      set({ loading: false, error: message });
      throw error;
    }
  },
}));
