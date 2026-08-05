import { create } from "zustand";
import type { ApiError } from "../../types/common/api";
import type { TeamItem } from "../../types/global/team.model";

type GlobalStoreState = {
  teams: TeamItem[];
  error: ApiError | null;
  selectedTeamId: number | null;
  selectedTeamLabel: string | null;
  setTeams: (teams: TeamItem[]) => void;
  setError: (error: ApiError | null) => void;
  resetTeams: () => void;
  setSelectedTeam: (team: TeamItem | null) => void;
};

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  teams: [],
  error: null,
  selectedTeamId: null,
  selectedTeamLabel: null,
  setTeams: (teams) =>
    set((state) => {
      const selectedTeam = teams.find(
        (team) => team.value === state.selectedTeamId,
      );

      return {
        teams,
        error: null,
        selectedTeamId: selectedTeam?.value ?? teams[0]?.value ?? null,
        selectedTeamLabel: selectedTeam?.label ?? teams[0]?.label ?? null,
      };
    }),
  setError: (error) =>
    set({
      error,
      teams: [],
      selectedTeamId: null,
      selectedTeamLabel: null,
    }),
  resetTeams: () =>
    set({
      teams: [],
      error: null,
      selectedTeamId: null,
      selectedTeamLabel: null,
    }),
  setSelectedTeam: (team) =>
    set({
      selectedTeamId: team?.value ?? null,
      selectedTeamLabel: team?.label ?? null,
    }),
}));

export type { GlobalStoreState };
