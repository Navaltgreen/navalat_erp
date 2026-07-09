export type LoginUser = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  first_time_login: boolean;
  fleet_uid: string | null;
  role_uid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  mobile: string | null;
  logout_datetime: string;
  first_login_datetime: number;
  imo: unknown[];
};

export type LoginResponse = {
  jwt: string;
  refreshToken: string;
  user: LoginUser;
};
