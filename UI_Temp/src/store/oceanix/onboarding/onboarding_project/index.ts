import { create } from "zustand";
import {
  createProject,
  getAllClients,
  getAllTeams,
} from "../../../../services/oceanix/onboaring/onboarding_project";
import type {
  Client,
  CreateProjectResponse,
  ProjectPayload,
  TeamOption,
} from "../../../../types/oceanix/onboarding/onboarding_project";

interface ClientState {
  loading: boolean;
  error: string | null;
  clients: Client[];
  teams: TeamOption[];
  fetchAllClient: () => Promise<void>;
  fetchAllTeams: () => Promise<void>;
  submitProject: (payload: ProjectPayload) => Promise<CreateProjectResponse>;
}

export const useProjectStore = create<ClientState>((set) => ({
  loading: false,
  error: null,
  clients: [],
  teams: [],

  fetchAllClient: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getAllClients();
      set({ loading: false, clients: res?.data?.clients });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create client";
      set({ loading: false, error: message });
      throw error;
    }
  },
  fetchAllTeams: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await getAllTeams();

      set({
        loading: false,
        teams: res.data.teams,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch teams";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },
  // Submit Project Details
  submitProject: async (payload: ProjectPayload) => {
    set({ loading: true, error: null });

    try {
      const res = await createProject(payload);

      set({ loading: false });

      return res;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create project";

      set({ loading: false, error: message });
      throw error;
    }
  },
}));
