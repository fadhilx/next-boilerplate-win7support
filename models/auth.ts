import { User } from "@prisma/client";

export type LoginFormDataType = {
  username: string;
  password: string;
  remember: boolean;
};
export type LoginSuccessResponse = {
  success: true;
  token: string;
  user: any;
  expiresIn: number;
};
export type SafeUser = Omit<User, "password">;
