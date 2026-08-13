import { dataApi } from "../../config/axios/dataApi";
import type { TeamItem } from "../../types/global/team.model";
import type { TeamApiEnvelope } from "../../types/global/team.response";

const TEAMS_ENDPOINT = "/api/v1/teams/all/";

export async function getTeams(): Promise<TeamItem[]> {
  const response = await dataApi.get<TeamApiEnvelope>(TEAMS_ENDPOINT);
  const teams = response.data.data?.teams;

  if (!teams) {
    return [];
  }

  return teams.map((team) => ({
    label: team.label,
    value: team.value,
  }));
}
