export type TeamMemberResponse = {
  id: number;
  name: string;
};

export type TeamWithMembersResponse = {
  team_id: number;
  team_name: string;
  members: TeamMemberResponse[];
};

export type TeamMembersPayload = {
  teams: TeamWithMembersResponse[];
};

export type TeamMembersApiEnvelope = {
  success: boolean;
  message: string;
  data: TeamMembersPayload | null;
  meta: Record<string, unknown>;
};
