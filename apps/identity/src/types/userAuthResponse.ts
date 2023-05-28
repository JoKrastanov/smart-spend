import { UserAccount } from "../models/userAccount";

export interface UserAuthResponse {
  token: string;
  refreshToken: string;
  user: UserAccount;
}
