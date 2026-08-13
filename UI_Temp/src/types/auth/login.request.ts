export type LoginRequest = {
  identifier: string;
  password: string;
  autoLogin: boolean;
  type: "account";
  redirectUrl: string | null;
};
