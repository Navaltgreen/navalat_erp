import { create } from "zustand";
import type { CreateWorkPayload, Project } from "../../../../types/oceanix/works/work_add";
import { createWork, getAllProjects } from "../../../../services/oceanix/works/work_add";


interface ClientState {
  loading: boolean;
  error: string | null;
  projects: Project[];
  fetchAllProjects: () => Promise<void>;
  submitWork: (data: CreateWorkPayload) => Promise<void>;
}

export const useWorkAddStore = create<ClientState>((set) => ({
  loading: false,
  error: null,
  projects: [],

  fetchAllProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAllProjects();
      set({
        loading: false,
        projects: res?.data?.projects,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create client";
      set({ loading: false, error: message });
      throw error;
    }
  },
  submitWork: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createWork(payload);
      set({loading: false});
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create client";
      set({ loading: false, error: message });
      throw error;
    }
  },
}));
