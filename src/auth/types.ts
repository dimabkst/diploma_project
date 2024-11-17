import { UserRole } from '../db/types';

export interface ILoginUserPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface ITokenData {
  id: number;
  userRole: UserRole;
  rememberMe?: boolean;
}

export interface IVerifiedTokenData extends ITokenData {}

export interface ICheckAuthOptions {
  allowUnauthenticated?: boolean;
  superAdminOnly?: boolean;
}
