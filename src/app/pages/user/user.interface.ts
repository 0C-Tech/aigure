export enum LoginStep {
  WELCOME = 'welcome',
  LOGIN = 'login',
  REGISTER = 'register',
  CONGRATULATION = 'congratulation',
  SETTING = 'setting',
  RESET = 'reset'
}

export interface User {
  id?: number;
  displayName?: string;
  email: string;
  password?: string;
  token?: string;
}

export interface BotInfo {
  id?: number;
  code?: string;
  displayName: string;
  greeting: string;
  description: string;
}
