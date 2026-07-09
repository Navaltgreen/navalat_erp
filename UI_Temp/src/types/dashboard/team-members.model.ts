export type TeamMember = {
  id: number;
  name: string;
};

export type TeamWithMembers = {
  teamId: number;
  teamName: string;
  members: TeamMember[];
};
