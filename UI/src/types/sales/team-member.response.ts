export type SalesTeamMemberResponse = {
  id: number;
  name: string;
};

export type SalesTeamMembersPayload = {
  teams: SalesTeamMemberResponse[];
};

export type SalesTeamMembersApiResponse = {
  success: boolean;
  message: string;
  data: SalesTeamMembersPayload | null;
  meta: Record<string, unknown>;
};
