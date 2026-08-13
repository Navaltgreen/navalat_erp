import { dataApi } from "../../config/axios/dataApi";
import type { TeamWithMembers } from "../../types/dashboard/team-members.model";
import type { TeamMembersApiEnvelope } from "../../types/dashboard/team-members.response";

const DASHBOARD_TEAM_MEMBERS_ENDPOINT = "/api/v1/teams/team-members/";

export async function getDashboardTeamMembers(): Promise<TeamWithMembers[]> {
  const response = await dataApi.get<TeamMembersApiEnvelope>(
    DASHBOARD_TEAM_MEMBERS_ENDPOINT,
  );

  const teams = response.data.data?.teams;

  if (!teams) {
    return [];
  }

  return teams.map((team) => ({
    teamId: team.team_id,
    teamName: team.team_name,
    members: team.members.map((member) => ({
      id: member.id,
      name: member.name,
    })),
  }));
}
