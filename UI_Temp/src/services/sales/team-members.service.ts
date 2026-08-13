import { dataApi } from "../../config/axios/dataApi";
import type { SalesTeamMember } from "../../types/sales/team-member.model";
import type { SalesTeamMembersApiResponse } from "../../types/sales/team-member.response";

const SALES_TEAM_MEMBERS_ENDPOINT =
  "/api/v1/teams/members";

export async function getSalesTeamMembers(
  teamId: number,
): Promise<SalesTeamMember[]> {
  const response = await dataApi.get<SalesTeamMembersApiResponse>(
    SALES_TEAM_MEMBERS_ENDPOINT,
    {
      params: { team_id: teamId },
    },
  );

  const members = response.data.data?.teams;

  if (!members) {
    return [];
  }

  return members.map((member) => ({
    id: member.id,
    name: member.name,
  }));
}
