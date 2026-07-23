import { create } from "zustand";

export type OnboardingTab = "client" | "project";

interface OnboardingTabState {
  activeTab: OnboardingTab;
  setActiveTab: (tab: OnboardingTab) => void;
}

export const useOnboardingTabStore = create<OnboardingTabState>((set) => ({
  activeTab: "client",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
