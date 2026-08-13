import { create } from "zustand";
import { createClient } from "../../../../services/oceanix/onboaring/onboarding_client";
import type { CreateClientResponse, FormDataPayload } from "../../../../types/oceanix/onboarding/onboarding_client";


interface ClientState {
  loading: boolean;
  error: string | null;
  lastCreatedClient: CreateClientResponse["data"] | null;
  createClient: (payload: FormDataPayload) => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  loading: false,
  error: null,
  lastCreatedClient: null,

  createClient: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await createClient(payload);
      set({ loading: false, lastCreatedClient: res?.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create client";
      set({ loading: false, error: message });
      throw error;
    }
  },
}));
