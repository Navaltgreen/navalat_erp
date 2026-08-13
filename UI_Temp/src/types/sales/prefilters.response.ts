export type SalesPrefiltersApiResponse = {
  success: boolean;
  message: string;
  data: {
    filters: {
      division?: string[];
      client?: string[];
      pic_for_proposal?: string[];
    };
  } | null;
  meta: Record<string, unknown>;
};

export type SalesPrefilters = {
  division: string[];
  client: string[];
  picForProposal: string[];
};
