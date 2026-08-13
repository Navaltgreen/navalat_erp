export type TeamResponse = {
  label: string;
  value: number;
};

export type TeamListResponse = {
  teams: TeamResponse[];
};

export type TeamApiEnvelope = {
  success: boolean;
  message: string;
  data: TeamListResponse | null;
  meta: Record<string, unknown>;
};
